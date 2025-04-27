<script lang="ts">
    import MatchHeadline from "../../../assesments/matchHeadline.svelte";"../../assesments/matchHeadline.svelte";
    import EndQuiz from "../../../assesments/05_EndQuiz.svelte";
    import FindSource_dnd from "../../../assesments/03_FindSource.svelte";
    import CognitiveBias from "../../../assesments/04_CognitiveBias.svelte";
    import { tick } from "svelte";
    import Motivation from "../../../assesments/02_motivations.svelte"
    import IntroductionText from "../../../assesments/01b_introductionText.svelte";
    import { onMount } from 'svelte';
    import { PUBLIC_VITE_API_ROOT } from "$env/static/public";
    import FunFactPopUp from "../../../components/FunFact.svelte"
    import NewsletterPopUp from "../../../components/Newsletter_Popup.svelte"
    import type {FunFact, FeedbackMeme} from "../../../types/interfaces.ts"
    import { Button } from 'flowbite-svelte';
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import "../../../styles/styles.css"
	import Motivations from "../../../assesments/02_motivations.svelte";

    import { writable } from "svelte/store";
    
    const state_game = writable<1 | 2 | 3 | 4 | 5>(1);
    let current_meme: FeedbackMeme | null = null;
    let funFactStore = writable<FunFact[]>([]);
    let feedbackMemes = writable<FeedbackMeme[]>([]);

    let usedFunFacts: FunFact[] = [];
    let usedFeedbackMemes: FeedbackMeme[] = [];

    let funfact_text = ""
    let funfact_header = ""



    async function getRandomFunFact() {
        showFunFact = false;
        await tick(); // wait one render tick

        if ($funFactStore.length === 0) {
            return null;
        }
        let randomIndex = Math.floor(Math.random() * $funFactStore.length);
        let randomFunFact = $funFactStore[randomIndex];
        if (usedFunFacts.includes(randomFunFact)) {
            console.log("Already used fun fact, getting a new one");
            if (usedFunFacts.length === $funFactStore.length) {
                console.log("All fun facts have been used");
                usedFunFacts = [];
            }
            return getRandomFunFact();
        }
        usedFunFacts.push(randomFunFact);
        funfact_text = randomFunFact.text;
        funfact_header = randomFunFact.title;
        console.log("show:", showFunFact);
        console.log("Random fun fact:", randomFunFact);
        console.log("Used fun facts:", usedFunFacts);
        await tick(); // ensure changes have been processed
        showFunFact = true;

        return randomFunFact;
    }

    async function get_random_meme(){
      if ($feedbackMemes.length === 0) {
        return null;
      }
      let randomIndex = Math.floor(Math.random() * $feedbackMemes.length);
      let randomFeedbackMeme = $feedbackMemes[randomIndex];
      if (usedFeedbackMemes.includes(randomFeedbackMeme)) {
        console.log("Already used feedback meme, getting a new one");
        if (usedFeedbackMemes.length === $feedbackMemes.length) {
          console.log("All feedback memes have been used");
          usedFeedbackMemes = [];
        }
        return get_random_meme();
      }
      usedFeedbackMemes.push(randomFeedbackMeme);
      return randomFeedbackMeme;
    }

    async function get_feedbackmemes(){
      let response = await fetch(PUBLIC_VITE_API_ROOT + "/api/Admin/FeedbackMeme/GetFeedbackMemes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json();
        feedbackMemes.set(data);
      } else {
        console.error("Error fetching feedback memes:", response.statusText);
      }
    }

    async function get_funfacts(){
      const category_id = 11;
      let response = await fetch(PUBLIC_VITE_API_ROOT + "/api/Admin/FunFacts/GetFunFactsByCategoryId/" + category_id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
    });
      if (response.ok) {
        const data = await response.json();
        funFactStore.set(data);
      } else {
        console.error("Error fetching fun facts:", response.statusText);
      }
    }

    onMount(() => {
        console.log('Component mounted');
        get_funfacts();
        console.log('Fun facts fetched');
        get_feedbackmemes();
        console.log('Feedback memes fetched');    
    });
    
    let showFunFact = false;
    let progress = 100
    const animatedProgress = new Tween(progress, { duration: 1000, easing: cubicOut });

// Whenever progress changes, update animatedProgress.
$: animatedProgress.set(progress*6757);
</script>

<div class="container">
    
    <!-- <EndQuiz />
     <MatchHeadline />
    <WheelOfEmotions />
    <FindSource_dnd />
    <CognitiveBias />
    -->
    
    <div class="container mx-auto p-4">
        <!-- Container with relative positioning -->
        <div class="progress-container relative w-full bg-gray-200 rounded-full dark:bg-gray-700 h-6 overflow-hidden">
          <!-- Progress fill -->
          <div
            class="progress-indicator relative bg-transparent text-white text-base font-medium text-center p-1 leading-none rounded-full"
            style="width: {progress}%"
          >
            👥  {animatedProgress.current.toFixed(0)}
          </div>
        </div>
    </div>
  <Button on:click={() => (progress = progress-(0.25*progress))} class="mt-8">
    Randomize
  </Button>

  <Button on:click={() => getRandomFunFact()} class="mt-8">
    get fun fact random
  </Button>

  <FunFactPopUp showFunFact={showFunFact} header={funfact_header} text={funfact_text}/>
  
  <Button on:click={async () => current_meme = await get_random_meme()} class="mt-8">
    get feedback meme random
  </Button>
  
  {#if current_meme}
    <img src={current_meme.imgSrc} alt="Feedback Meme" class="w-1/2 mx-auto mt-4" />
  {/if}
</div>


{#if $state_game === 1}
    <IntroductionText />
{/if}

{#if $state_game === 2}
    <Motivations/>
{/if}

{#if $state_game === 3}
    <FindSource_dnd />
{/if}

{#if $state_game === 4}
    <CognitiveBias />
{/if}

{#if $state_game === 5}
    <EndQuiz />
{/if}

<Button on:click={() => state_game.update(n => (n < 5 ? (n + 1) as 1 | 2 | 3 | 4 | 5 : n))} class="mt-8">
    Další levl
  </Button>

