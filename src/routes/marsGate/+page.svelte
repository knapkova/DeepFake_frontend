<script lang="ts">
	import EndQuiz from '$assesments/05_EndQuiz.svelte';
	import FindSource_dnd from '$assesments/03_FindSource.svelte';
	import CognitiveBias from '$assesments/04_CognitiveBias.svelte';
	import { tick } from 'svelte';
	import IntroductionText from '$assesments/01b_introductionText.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import FunFactPopUp from '$components/FunFact.svelte';
	import NewsletterPopUp from '$components/Newsletter_Popup.svelte';
	import type { FunFact, FeedbackMeme, Category } from '$types/interfaces.ts';
	import { Button } from 'flowbite-svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import ProgressBar from '$components/ProgressBar.svelte';
	import { derived } from 'svelte/store';

	import '$styles/styles.css';
	import IntroductionWindow from '$components/IntroductionWindow.svelte';
	import Motivations from '$assesments/02_motivations.svelte';
	import { writable } from 'svelte/store';
	import { nickname, state_game, progress } from '$stores/app';
	import { goto } from '$app/navigation';

	let level_name = writable('');

	const categoryId = 11;

	const api_get_category = '/api/Admin/Categories/GetCategoryById/' + categoryId;

	let category = writable<Category | null>(null);

	let funFactStore = writable<FunFact[]>([]);
	let feedbackMemes = writable<FeedbackMeme[]>([]);

	let usedFunFacts: FunFact[] = [];

	let funfact_text = writable('');
	let funfact_header = writable('');
	let showFunFact = writable(false);

	function handleRestart() {
		// clear persisted values
		localStorage.removeItem('state_game');
		localStorage.removeItem('progress');
		localStorage.removeItem('nickname');
		// reset stores
		state_game.set(1);
		progress.set(100);
		setLevelName();
		goto('/');
	}

	const showNewsletter = derived(state_game, ($state_game) => $state_game === 7);

	//let progress = writable(100);

	async function getCategory() {
		const response = await fetch(PUBLIC_VITE_API_ROOT + api_get_category, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		console.log('Response:', response);
		const data = await response.json();
		category.set(data);
		console.log('Category data:', data);
		feedbackMemes.set(data.feedbackMemes);
		console.log('Feedback memes:', data.feedbackMemes);
		funFactStore.set(data.funFacts);
		console.log('Fun facts:', data.funFacts);
	}

	async function handleLevelComplete() {
		if ($state_game !== 7 && $state_game !== 6) {
			getRandomFunFact();
		}
		state_game.update((n) => (n < 7 ? ((n + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7) : n));
		await tick();
		progress.set($progress - 0.25 * $progress);
		setLevelName();
	}

	function setLevelName() {
		switch ($state_game) {
			case 1:
				level_name.set('🔍 První zpráva');
				break;
			case 2:
				level_name.set('🔍 První zpráva');
				break;
			case 3:
				level_name.set('🧩 Kdo a proč?');
				break;
			case 4:
				level_name.set('📷 Důkazy pod lupou');
				break;
			case 5:
				level_name.set('🧠 Proč tomu lidé věří?');
				break;
			case 6:
				level_name.set('🎭 Závěrečný kvíz');
				break;
		}
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
			console.log('Already used fun fact, getting a new one');
			if (usedFunFacts.length === $funFactStore.length) {
				console.log('All fun facts have been used');
				usedFunFacts = [];
			}
			return getRandomFunFact();
		}
		usedFunFacts.push(randomFunFact);
		funfact_header.set(randomFunFact.title);
		funfact_text.set(randomFunFact.text);

		console.log('show:', showFunFact);
		console.log('Random fun fact:', randomFunFact);
		console.log('Used fun facts:', usedFunFacts);
		await tick(); // ensure changes have been processed
		showFunFact.set(true);

		return randomFunFact;
	}

	onMount(() => {
		setLevelName();
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
		<div class="current_lvl">{$level_name}</div>

		<div
			class="progress-container relative h-6 w-full overflow-hidden rounded-full bg-gray-400 dark:bg-gray-700"
		>
			<ProgressBar {progress} />
		</div>

		<FunFactPopUp showFunFact={$showFunFact} header={$funfact_header} text={$funfact_text} />
	</div>
{/if}

{#if $state_game === 2}
	<IntroductionText onLevelComplete={handleLevelComplete} />
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
  <section class="end-screen">
    <div class="message-container">
      <h1 class="title">Gratulujeme k úspěšnému dokončení hry!</h1>
      <p class="subtitle">jupii!!</p>
      <p class="message">Progress bar nedosáhl nuly, ale i to je realita dnešní doby. Není v našich silách přesvědčit všechny.</p>
      <p class="note">Důležité je, se o to alespoň pokusit</p>
    </div>

    <button
      onclick={handleRestart}
    >
      Vrátit se na hlavní obrazovku
    </button>

    <NewsletterPopUp
      showNewsletter={$showNewsletter}
    />
  </section>
{/if}

<Button on:click={handleRestart} class="mt-8">Restart</Button>

<Button on:click={() => state_game.set(1)} class="mt-8">začátek</Button>

<Button
	on:click={() => state_game.update((n) => (n < 8 ? ((n - 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7) : n))}
	class="mt-8"
>
	Zpět
</Button>

<Button
	on:click={() => state_game.update((n) => (n < 7 ? ((n + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7) : n))}
	class="mt-8"
>
	Další levl
</Button>

<style>
	.container {
		max-width: none;
		width: 100%;
		padding: 0;
		margin: 0 auto;
	}
	.current_lvl {
		font-size: 0.875rem; /* small text */
		font-weight: 500; /* medium weight */
		color: #6b7280; /* gray-500 */
		text-transform: uppercase; /* uppercase */
		letter-spacing: 0.05em; /* a bit of tracking */
		margin-bottom: 0.5rem; /* space before bar */
	}
	.end-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    background: linear-gradient(135deg, #eef2f7, #dfe7ed);
    min-height: 80vh;
    box-sizing: border-box;
  }

  /* Card holding the messages */
  .message-container {
    background: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    max-width: 600px;
    width: 100%;
    text-align: center;
    margin-bottom: 2rem;
    animation: fadeInUp 0.5s ease-out both;
  }

  .message-container .title {
    font-size: 2.5rem;
    color: #1f2a37;
    margin-bottom: 1rem;
    letter-spacing: 1px;
  }

  .message-container .subtitle {
    font-size: 1.25rem;
    color: #334e68;
    margin-bottom: 0.75rem;
  }

  .message-container .message {
    font-size: 1rem;
    color: #486581;
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  .message-container .note {
    font-size: 0.9rem;
    color: #829ab1;
    margin-top: 1rem;
    font-style: italic;
  }


  /* Keyframes for fadeInUp */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

