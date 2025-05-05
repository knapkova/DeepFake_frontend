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

    let rotation = 180;
    let funfact = false;
    let quizCompleted = false;

  // Example emoji positions (left and top in pixels)
  const baseEmoji = { emoji: "𖨆", moved: false };
  let emojiPositions = [
  { x: 600, y: 60, ...baseEmoji },
  { x: 660, y: 60, ...baseEmoji },
  { x: 720, y: 60, ...baseEmoji }
];

  let allMoved = false;
  $: allMoved = emojiPositions.every(e => e.moved);

  

  

    
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

    function draggable(node: HTMLElement, emoji: { x: number; y: number; emoji: string; moved: boolean }) {
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
      node.style.left = emoji.x + "px";
      node.style.top = emoji.y + "px";
    }

    function handlePointerUp(event: PointerEvent) {
      node.releasePointerCapture(event.pointerId);
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerup", handlePointerUp);

      if (!emoji.moved) {
        emoji.moved = true;
        // re-assign to trigger Svelte’s reactivity
        emojiPositions = emojiPositions.slice();
      }
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
<div class="article" in:fly={{x:300,duration:400}} out:fly={{x:-300}}>
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
  <div class="emotions-layout" in:fly={{x:300,duration:400}} out:fly={{x:-300}}>
    <div class="emoji-box">
      <p class="emoji-box-title">Příspěvek strhl vlnu emocí. Jaké emoce myslíš, že takový příspěvek v lidech nejspíš vyvolá? <b>Vyber tři nejsilnější a přesuň na ně panáčka.</b> Můžeš si také udělat screen ze své odpovědi.</p>

      <div class="emoji-container">
        {#each emojiPositions as emoji (emoji.emoji + '-' + emoji.x + '-' + emoji.y)}
          <span
            use:draggable={emoji}
            class="emoji"
            style="left: {emoji.x}px; top: {emoji.y}px;"
          >
            {emoji.emoji}
          </span>
        {/each}
      </div>
    </div>

    <!-- Wheel image on the right -->
    <div class="image-container">
      <img
        src="/wheeel.png"
        alt="Otáčející se panáček"
        class="article-image"
        style="transform: rotate({rotation}deg);"
      />
      {#each emojiPositions as emoji (emoji.emoji + '-' + emoji.x + '-' + emoji.y)}
        <!-- you may keep your overlays here if desired -->
      {/each}
      <div class="slider-container">
        <input type="range" min="0" max="360" step="1" bind:value={rotation} />
        <div class="controls">
          <div class="angle">Otoč 🔄</div>
          
        </div>
      </div>

      {#if allMoved}
      <button class="btn btn-primary" on:click={() => state.set('quiz')}>
        Pokračovat
      </button>
  {/if}
    </div>

  </div>

  
  
{/if}

{#if $state === 'quiz'}
<div class="quiz-container" in:fly={{x:300,duration:400}} out:fly={{x:-300}}>
  <h2>Slovník</h2>
  <p>Ještě než se ponoříme do příběhu, přiřaď správné definice k pojmům z článku:</p>

  <DndConditional {quiz} onQuizComplete={() => { quizCompleted = true; }}/>
  {#if quizCompleted}
    <div class="quiz-completed">
      <h2>Vše přiřazeno!</h2>
      <button class="btn" on:click={() => state.set('end')}>Jdeme dál! ✅</button>
    </div>
  {:else}
    <div class="quiz-in-progress">
      <p>...</p>
    </div>
  {/if}
</div>
{/if}

{#if $state === 'end'}
    <div class="end" in:fly={{y:200,duration:500,easing:backOut}}>
      
      <h2>🎉 gratulace!</h2>
      <p>Hotovson</p>
      <button class="btn" on:click={() => completeLevel()}>Jsem ready jít dál</button>
    </div>
  {/if}

 <!-- <GlowButton/> -->



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
  width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .image-container {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: flex-start;
      align-content: space-around;
      flex-wrap: nowrap;
      background-color: #fff;
      border-radius: 10%;
      flex-direction: column;
      align-items: center;
  position: relative;
      z-index: 1;           /* wheel sits below */
    }
    
    .emoji {
      position: absolute;
      font-size: 3rem;
      cursor: move;
      user-select: none;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      background: rgb(59 52 52 / 80%);
      border-radius: 10%;
      padding: 0.2rem 1rem;
      z-index: 999;
      color: white;
  
  }
    
    
    .slider-container input[type="range"] {
      width: 80%;
    }
  
    .emoji-box {
    position: relative;
    margin: 2rem auto;
    padding: 1rem;
    max-width: 100rem;
    height: 250px;
    background: #ffffff;
    border: 2px dashed #ccc;
    border-radius: 16px;
  }
  
  .emoji-box-title {
    margin-bottom: 10px;
    text-align: center;
    color: #333;
  }
  
  /* Emoji container positioning relative to box */
  .emoji-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .emotions-layout {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;  /* ensures responsiveness on small screens */
      margin: 2rem 20rem;
    }
  
  
    .slider-container {
      margin-top: 3.5rem;
      text-align: center;
    }
    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 400px;
      margin: 0.5rem auto;
    }
    .angle {
      color: #555;
    }

    .quiz-container{
      margin: 2rem auto;
    }
  </style>