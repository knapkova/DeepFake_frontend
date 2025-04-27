<script lang="ts">
    import { onMount } from "svelte"
    import GlowButton from "$lib/glow_button.svelte"
    import {PUBLIC_VITE_API_ROOT} from "$env/static/public"
    import { writable } from "svelte/store"
    import type { AssignmentIntroductionArticle, StartQuiz } from "$types/interfaces"
    import DndConditional from "$lib/dnd_conditional_fr_now.svelte"
    import { fly, fade, scale } from "svelte/transition";
    import { cubicOut, backOut } from "svelte/easing";
    import FunFact from "../components/FunFact.svelte"
    

     export let onLevelComplete: () => void = () => {};

    // Call this function when the level is ready to complete.
    function completeLevel() {
      onLevelComplete();
    }

    let rotation = 0;
    let funfact = false;

  // Example emoji positions (left and top in pixels)
  const baseEmoji = { emoji: "𖨆" };
  let emojiPositions = [
    { x: 20, y: 400, ...baseEmoji },
    { x: 80, y: 400, ...baseEmoji },
    { x: 140, y: 400, ...baseEmoji }
  ];
    
    const state = writable<'start' | 'emotions' | 'quiz' | 'end'>('start');

    const article_id = 6
    let article = writable<AssignmentIntroductionArticle[]>([])
    let quiz = writable<StartQuiz[]>([])
    const get_req = "/api/Admin/AssignmentIntroductionArticle/GetAssignmentIntroductionArticlesById/" + article_id

    onMount(() => {
    fetchArticle().then((data) => {
      article.set(data);
      if (data.length > 0) {
        // Extract the quiz questions from the article and update the quiz store.
        quiz.set(data[0].questions);
      }
    });
  });

    async function fetchArticle() {
      const response = await fetch(PUBLIC_VITE_API_ROOT + get_req, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
          },
      });
      const data = await response.json();
      console.log("data", data);
      const fetchedArticle: AssignmentIntroductionArticle[] = 
          Array.isArray(data) ? data : [data];
      return fetchedArticle;
  }

    function draggable(node: HTMLElement, emoji: { x: number; y: number; emoji: string }) {
    let startX: number, startY: number;

    function handlePointerDown(event: PointerEvent) {
      startX = event.clientX - emoji.x;
      startY = event.clientY - emoji.y;
      node.setPointerCapture(event.pointerId);
      node.addEventListener("pointermove", handlePointerMove);
      node.addEventListener("pointerup", handlePointerUp);
    }

    function handlePointerMove(event: PointerEvent) {
      emoji.x = event.clientX - startX;
      emoji.y = event.clientY - startY;
      // Update the element's style immediately.
      node.style.left = emoji.x + "px";
      node.style.top = emoji.y + "px";
    }

    function handlePointerUp(event: PointerEvent) {
      node.releasePointerCapture(event.pointerId);
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerup", handlePointerUp);
    }

    node.addEventListener("pointerdown", handlePointerDown);

    return {
      destroy() {
        node.removeEventListener("pointerdown", handlePointerDown);
      }
    };
  }
    
</script>



{#if $state === 'start'}
<div class="article">
    {#if $article.length > 0}
      <h2>{$article[0].title}</h2>
      <div class="content">
        {@html $article[0].content}
      </div>
      <img src={$article[0].imgSrc} alt="" class="article-image" />
      <p>{$article[0].Instructions}</p>
    {:else}
      <p>Načítám článek...</p>
    {/if}
    <button on:click={() => state.set('emotions')} class="btn btn-primary">
        Pokračovat </button>
</div>


{/if}

{#if $state === 'emotions'}
<div class="image-container">
  <!-- Rotatable image -->
  <img
    src="/wheeel.png"
    alt=""
    class="article-image"
    style="transform: rotate({rotation}deg); transition: transform 0.3s ease;"
  />
  <!-- Draggable emoji overlays -->
  {#each emojiPositions as emoji (emoji.emoji + '-' + emoji.x + '-' + emoji.y)}
    <span
      use:draggable={emoji}
      class="emoji"
      style="position: absolute; left: {emoji.x}px; top: {emoji.y}px; cursor: move;"
    >
      {emoji.emoji}
    </span>
  {/each}
</div>
<div class="slider-container">
  <input type="range" min="0" max="360" step="1" bind:value={rotation} />
  <p>Rotation: {rotation}°</p>
  <button on:click={() => state.set('quiz')} class="btn btn-primary">
      Pokračovat </button>
</div>
{/if}

{#if $state === 'quiz'}
<div class="quiz-container" in:fly={{x:300,duration:400}} out:fly={{x:-300}}>
  <DndConditional {quiz}/>
  <button class="btn" on:click={() => state.set('end')}>Finish ✅</button>
</div>
{/if}

{#if $state === 'end'}
    <div class="end" in:fly={{y:200,duration:500,easing:backOut}}>
      
      <h2>🎉 Congratulations!</h2>
      <p>You completed the challenge.</p>
      <button class="btn" on:click={() => completeLevel()}>Jsem ready jít dál</button>
    </div>
    <button on:click={() => funfact = !funfact} class="btn btn-primary">
        Fun Fact </button>
    <FunFact showFunFact={funfact} header="Fun Fact" text="Did you know that the average person spends about 6 months of their life waiting for red lights to turn green?"/>

  {/if}

  <GlowButton/>




<style>
  /* Basic article styling */
  .article {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
  }

  
  /* Image styling */
  .article-image {
    max-width: 100%;
    display: block;
    margin: 10px auto;
  }
  
  .image-container {
    position: relative;
    display: inline-block;
    margin: 20px auto;
  }
  
  /* Emoji styling */
  .emoji {
  font-size: 2rem;
  color: #fff;
  user-select: none;
  cursor: move;
  /* Adding a text shadow to give better contrast */
  text-shadow: 0 2px 4px rgba(224, 216, 216, 0.7);
  /* Optionally add a light background with border-radius */
  background-color: rgba(0, 0, 0, 0.8);
  padding-right: 1rem;
  padding-left: 1rem;
  border-radius: 50%;
}
  
  /* Slider container styling */
  .slider-container {
    margin-top: 20px;
    text-align: center;
  }
  
  .slider-container input[type="range"] {
    width: 80%;
  }
</style>