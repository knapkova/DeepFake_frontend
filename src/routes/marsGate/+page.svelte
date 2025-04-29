<script lang="ts">
    import type { ParamMatcher } from '@sveltejs/kit';

    import EndQuiz from "$assesments/05_EndQuiz.svelte"
    import FindSource_dnd from "$assesments/03_FindSource.svelte";
    import CognitiveBias from "$assesments/04_CognitiveBias.svelte";
    import { tick } from "svelte";
    import IntroductionText from "$assesments/01b_introductionText.svelte";
    import { onMount, onDestroy } from 'svelte';
    import { beforeNavigate } from '$app/navigation';
    import { PUBLIC_VITE_API_ROOT } from "$env/static/public";
    import FunFactPopUp from "$components/FunFact.svelte"
    import NewsletterPopUp from "$components/Newsletter_Popup.svelte"
    import type {FunFact, FeedbackMeme, Category} from "$types/interfaces.ts"
    import { Button } from 'flowbite-svelte';
    import { Tween } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import ProgressBar from "$components/ProgressBar.svelte";
    import { derived } from "svelte/store";

    

    import "$styles/styles.css"
    import IntroductionWindow from "$components/IntroductionWindow.svelte"
	import Motivations from "$assesments/02_motivations.svelte";
    import { writable } from "svelte/store";

    function persisted<T>(key: string, init: T) {
    let initial: T;
    try {
      const raw = localStorage.getItem(key);
      initial = raw ? JSON.parse(raw) : init;
    } catch {
      initial = init;
    }
    const store = writable<T>(initial);
    store.subscribe((v) => {
      try { localStorage.setItem(key, JSON.stringify(v)); }
      catch {} // ignore quota errors
    });
    return store;
  }

  // persist both your “which screen” and “progress” stores
  export const state_game    = persisted<1|2|3|4|5|6|7>('state_game', 1);
  export const progress     = persisted<number>('progress',   100);

    const categoryId = 11;

    const api_get_category = "/api/Admin/Categories/GetCategoryById/" + categoryId;

    let category = writable<Category | null>(null);

    
    //let state_game = writable<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
    const current_meme = writable<FeedbackMeme | null>(null);
    let funFactStore = writable<FunFact[]>([]);
    let feedbackMemes = writable<FeedbackMeme[]>([]);

    let usedFunFacts: FunFact[] = [];
    let usedFeedbackMemes: FeedbackMeme[] = [];

    let funfact_text = writable("");
    let funfact_header =writable("");    
    let showFunFact = writable(false);
    
    const showNewsletter = derived(state_game, $state_game => $state_game === 7);


    //let progress = writable(100);

    async function getCategory() {
       const response =  await fetch(PUBLIC_VITE_API_ROOT + api_get_category, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        console.log("Response:", response);
        const data = await response.json();
        category.set(data);
        console.log("Category data:", data);
        feedbackMemes.set(data.feedbackMemes);
        console.log("Feedback memes:", data.feedbackMemes);
        funFactStore.set(data.funFacts);
        console.log("Fun facts:", data.funFacts);
    }

    async function handleLevelComplete() {
      getRandomFunFact()
      state_game.update(n => (n < 7 ? (n + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7: n))
      await tick()
      progress.set($progress-(0.25*$progress))

  }


    async function getRandomFunFact() {
        showFunFact.set(false);
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
        funfact_header.set(randomFunFact.title);
        funfact_text.set(randomFunFact.text);
        
        console.log("show:", showFunFact);
        console.log("Random fun fact:", randomFunFact);
        console.log("Used fun facts:", usedFunFacts);
        await tick(); // ensure changes have been processed
        showFunFact.set(true);

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

    onMount(() => {
        getCategory();
    });

    
    
    
    const animatedProgress = new Tween(0, { duration: 400, easing: cubicOut });

// Whenever progress changes, update animatedProgress.
$effect(() => {
    animatedProgress.set($progress * 6757);
});
</script>


{#if $state_game === 1}
    <IntroductionWindow {state_game} on:stateChange={(e) => state_game.set(e.detail)} />
{/if}

{#if $state_game != 1}

<div class="container">
    
  <div class="progress-container relative w-full bg-gray-400 rounded-full dark:bg-gray-700 h-6 overflow-hidden">
          <ProgressBar {progress} />
        </div>

<FunFactPopUp showFunFact={$showFunFact} header={$funfact_header} text={$funfact_text}/>



{#if $current_meme}
  <img src={$current_meme.imgSrc} alt="Feedback Meme" class="w-1/2 mx-auto mt-4" />
{/if}
</div>
{/if}




{#if $state_game === 2}
  <IntroductionText onLevelComplete={handleLevelComplete}  />
  {progress.set(100)}
{/if}

{#if $state_game === 3}
  <Motivations onLevelComplete={handleLevelComplete} />
{/if}

{#if $state_game === 4}
  <FindSource_dnd onLevelComplete={handleLevelComplete} />
{/if}

{#if $state_game === 5}
  <CognitiveBias onLevelComplete={handleLevelComplete} />
{/if}

{#if $state_game === 6}
  <EndQuiz onLevelComplete={handleLevelComplete} />
{/if}

{#if $state_game === 7}
  <NewsletterPopUp showNewsletter={$showNewsletter} />
{/if}

<Button on:click={() => state_game.set(1)} class="mt-8">
  začátek
</Button>

<Button on:click={() => state_game.update(n => (n < 8 ? (n - 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 : n))} class="mt-8">
  Zpět
</Button>

<Button on:click={() => state_game.update(n => (n < 7 ? (n + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 : n))} class="mt-8">
    Další levl
 </Button>

