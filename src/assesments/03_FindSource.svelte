<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { writable, get } from 'svelte/store';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import LensExplanationPopup from '$components/LensExplanation_popup.svelte';
	import LensPrequel from '$components/LensPrequel.svelte';
	import SortableList from '$components/sortable_list_lens.svelte';
	import { Input } from 'flowbite-svelte';
	import type { AssignmentFindPictureSource } from '$types/interfaces';
	import { user } from '$stores/auth';

	export let onLevelComplete: () => void = () => {};
	let showTutorial = writable(false);

	let sortFinished = false;
	function handleSortFinish(correct: boolean) {
		if (correct) {
			sortFinished = true;
		}
	}

	function completeLevel() {
		onLevelComplete();
	}


	let category_id = 11;
	// Per-image user answers; initialize after fetch
	let userAnswers: string[] = [];

// Per-image feedback: 'correct' | 'wrong' | 'error' | ''
let userFeedback: string[] = [];
// Per-image loading state
let userLoading: boolean[] = [];
// Per-image attempts counter
let userAttempts: number[] = [];
// Per-image revealed correct answer (fetched after attempts exhausted)
// Flag that becomes true when all items are finished (correct or revealed)
let allFinished = false;


	const api_get_pictures = '/api/Admin/AssignmentGoogleLens/GetPhotosByCategory/'
	const api_check_answers = '/api/Admin/AssignmentGoogleLens/CheckCorrectAnswer'


	let imageItems = writable<AssignmentFindPictureSource[]>([]);

	async function assertAnswer(photoId: number, userAnswer: string) {
		let url = `${PUBLIC_VITE_API_ROOT}${api_check_answers}?photoId=${photoId}&userAnswer=${encodeURIComponent(
			userAnswer
		)}`;
		console.log('Asserting answer with URL:', url);
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			// Backend contract:
			// - returns 200 OK with message for correct answer
			// - returns 404 NotFound for incorrect answer
			if (response.ok) {
				// correct
				return { ok: true, isCorrect: true };
			} else if (response.status === 404) {
				// incorrect answer
				return { ok: true, isCorrect: false };
			} else {
				console.warn('Server returned unexpected status', response.status);
				return { ok: false, isCorrect: false };
			}
		} catch (error) {
			console.error('Error while asserting answer', error);
			return { ok: false, isCorrect: false };
		}
	}

	// previously we fetched acceptable source from the API; backend now includes it in img.correctAnswer

	// wrapper to call assertAnswer and set per-image feedback
	async function checkAnswer(photoId: number, userAnswer: string, index: number) {
		// ensure feedback array has same length
		if (!userFeedback || userFeedback.length < userAnswers.length) {
			userFeedback = userAnswers.map(() => '');
		}

		// ensure loading array
		if (!userLoading || userLoading.length < userAnswers.length) {
			userLoading = userAnswers.map(() => false);
		}

		// prevent duplicate checks for the same item
		if (userLoading[index]) return false;

		// set loading
		userLoading[index] = true;
		userLoading = [...userLoading];

		const result = await assertAnswer(photoId, userAnswer);

		if (!result.ok) {
			userFeedback[index] = 'error';
			userFeedback = [...userFeedback];
			userLoading[index] = false;
			userLoading = [...userLoading];
			return false;
		}

		// increment attempts only when the server answered (correct or incorrect)
		userAttempts[index] = (userAttempts[index] || 0) + 1;
		userAttempts = [...userAttempts];

		if (result.isCorrect) {
			userFeedback[index] = 'correct';
			userFeedback = [...userFeedback];
		} else {
			// wrong answer
			if (userAttempts[index] >= 3) {
				// reveal correct answer from the already-fetched items (backend now provides correctAnswer)
				const items = get(imageItems);
				const correct = items[index]?.correctAnswer ?? '';
				// store it in the feedback state for display
				userFeedback[index] = 'revealed';
				userFeedback = [...userFeedback];
				// also store answer into userAnswers so it can be shown in UI if needed
				userAnswers[index] = correct;
				userAnswers = [...userAnswers];
			} else {
				userFeedback[index] = 'wrong';
				userFeedback = [...userFeedback];
			}
		}

		userLoading[index] = false;
		userLoading = [...userLoading];

		// If all items are finished (either correct or revealed after attempts), move to done
		const allDone = get(imageItems).every((_it, idx) => {
			return userFeedback[idx] === 'correct' || userFeedback[idx] === 'revealed';
		});
		if (allDone) {
			// mark finished and show the 'Pokračovat' button instead of auto-switching
			allFinished = true;
		}

		return result.isCorrect;
	}
	

	type GameState = 'start' | 'explain' | 'play' | 'done' | 'sorting';
	let state: GameState = 'start'; // TODO set to 'start' for intro

	let lensIntroComplete = false;

	async function handleLensIntroComplete() {
		await tick();
		await new Promise((resolve) => setTimeout(resolve, 2000));

		lensIntroComplete = true;
	}

	onMount(async () => {
		const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_get_pictures}${category_id}`);
		const data = await response.json();
		imageItems.set(data);
		userAnswers = data.map(() => '');
		userFeedback = data.map(() => '');
		userLoading = data.map(() => false);
		userAttempts = data.map(() => 0);

		console.log('Fetched image items:', data);
	});

	function startGame() {
		state = 'play';
	}

	function submitResults() {
		state = 'sorting';
	}



	
	
</script>

<div class="container">
	{#if state === 'start'}
		{#if lensIntroComplete}
			<div class="start-layout">
				<h2 class="start-heading">🚀 Připrav se!</h2>
				<div class="left-card">
					<p class="intro-text">
						Ivan přidává další materiály – několik fotografií, které podle něj dokazují, že přistání
						na Marsu už proběhlo. … Dokážeš o nich zjistit víc?
					</p>
					<button on:click={startGame}>Začít hru</button>
				</div>
				<div class="right-images">
					<img src="/mars_fake2.webp" alt="Mars falešný 2" />
				</div>
			</div>
		{:else}
			<LensPrequel onComplete={handleLensIntroComplete} />
		{/if}


	{:else if state === 'play'}
		<LensExplanationPopup showLensExplanation={true} />
		<div class="game-header">
			<button on:click={() => showTutorial.set(true)}> 📸 Google Lens návod</button>
			<LensExplanationPopup bind:showLensExplanation={$showTutorial} />
						<p>Najdi pomocí Google Lens správný zdroj. Pokud potřebuješ pomoct, mrkni na návod výše!</p>

		</div>
			<!-- Images Grid -->
				<div class="cards-grid">
					{#each $imageItems as img, i}
						<div class="card-wrapper" data-index={i}>
							<div class="image-box">
								<img class="card" src={img.imgSrc} alt="Obrázek" loading="lazy" />
								<button class="dl-btn" aria-label="Stáhnout" title="Stáhnout">
									<a href={img.imgSrc} target="_blank" rel="noopener noreferrer">📥</a>
								</button>
							</div>
							<div class="answer-section">
								<Input class="my-2 w-full" placeholder="napiš popis obrázku..." bind:value={userAnswers[i]} />
								<button on:click={() => checkAnswer(img.id, userAnswers[i], i)} class="check-btn" disabled={userLoading[i] || userFeedback[i] === 'correct' || userFeedback[i] === 'revealed'}>
									{#if userLoading[i]}Kontroluji…{:else}Zkontrolovat{/if}
								</button>
								{#if userFeedback && userFeedback[i]}
									{#if userFeedback[i] === 'correct'}
										<p class="feedback correct">Správně ✅</p>
									{:else if userFeedback[i] === 'wrong'}
										<p class="feedback wrong">Špatně ❌</p>
										<p class="attempts">Pokus {userAttempts[i]} / 3</p>
									{:else if userFeedback[i] === 'revealed'}
										<p class="feedback correct">Správná odpověď: {img.correctAnswer ?? 'není k dispozici'}</p>
									{:else}
										<p class="feedback error">Chyba při ověřování</p>
									{/if}
								{/if}
							</div>
						</div>
					{/each}
				</div>
					{#if allFinished}
						<div class="good-job">
							<p>Hotovo — můžeš pokračovat.</p>
							<button on:click={submitResults}>Pokračovat</button>
						</div>
					{/if}
	{:else if state === 'done'}
		<h3>Zvládl jsi rozpoznat všechny nástrahy?</h3>
		<button on:click={() => (state = 'sorting')}> Jdeme dál </button>
	{:else if state == 'sorting'}
		<SortableList onComplete={handleSortFinish} />
		{#if sortFinished}
			<p>Skvěle!</p>
			<button on:click={() => completeLevel()}>Pokračovat</button>
		{/if}
	{/if}
</div>

<style>
	.answer-section {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.start-layout {
		background: linear-gradient(135deg, #f0f9ff, #cbebff);
		border-radius: 16px;
		padding: 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		animation: fadeIn 0.5s ease-out both;
	}

	.start-heading {
		width: 100%;
		text-align: center;
		font-size: 2rem;
		margin-bottom: 1rem;
		animation: fadeInUp 0.5s ease-out both;
	}

	.column h3  {
		position: relative;
		font-size: 1.4rem;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		background: linear-gradient(90deg, #ff2121, #fe7b7b);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 1rem;
		padding-bottom: 0.25rem;
	}

	.column h3::after{
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 40px;
		height: 3px;
		background: #ec2020;
		border-radius: 2px;
	}

	/* optional: add a little icon before */
	.column h3::before {
		content: '📌';
		margin-right: 0.5rem;
	}
	.game-header {
		
    /* border: 3px black; */
    border: 2px solid #bb703e;
    display: flex
;
    background: white;
    /* border-radius: 5%; */
    padding: 1rem;
    flex-direction: column;
	}
	.good-job {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		max-width: 500px;
		margin: 1.5rem auto;
		padding: 1rem 1.5rem;

		background: #e6ffed; /* very light green */
		border: 1px solid #34cb4d; /* bright accent */
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

		text-align: center;
		gap: 0.5rem;
	}
	.start-layout {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin: 20px 0;
		align-items: flex-start;
	}

	.left-card {
		flex: 1 1 300px;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		text-align: center;
	}

	.intro-text {
		margin: 0 0 16px;
		line-height: 1.6;
		color: #333;
	}

	.right-images {
		flex: 1 1 300px;
		display: flex;
		justify-content: center;
	}
	.right-images img {
		max-width: 100%;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.container {
		max-width: 1200px;
		margin: 1rem auto;
		text-align: center;
	}

	h2 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	p
	 {
		font-size: 1rem;
		color: #666;
		margin: 0.5rem 0;
	}

	.row {
		display: flex;
		gap: 2rem;
		margin-top: 1rem;
		align-items: flex-start;
		justify-content: center;
		flex-wrap: wrap;
		background: white;
		padding: 1rem 0;
	}

	.column
	 {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: self-end;
		min-width: 260px;
	}

	/* New responsive grid for play state images */
	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 1.25rem;
		margin: 1.5rem auto;
		width: 100%;
		max-width: 1100px;
		align-items: start;
	}

	.card-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		padding: 0.75rem 0.75rem 0.9rem;
		border-radius: 12px;
		box-shadow: 0 2px 6px rgba(0,0,0,0.04);
		position: relative;
		transition: box-shadow .25s ease, transform .25s ease;
	}
	.card-wrapper:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); transform: translateY(-2px); }

	.image-box {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 3; /* consistent frame */
		overflow: hidden;
		border-radius: 10px;
		background: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-wrapper img.card {
		width: 100%;
		height: 100%;
		object-fit: cover; /* cover to fill frame */
		display: block;
	}

	.dl-btn {
		position: absolute;
		top: 6px;
		right: 6px;
		background: rgba(255,255,255,0.85);
		border: 1px solid #d1d5db;
		border-radius: 6px;
		padding: 0.2rem 0.45rem;
		font-size: 1.25rem;
		cursor: pointer;
		transition: background .2s ease, box-shadow .2s ease;
		line-height: 1;
	}
	.dl-btn:hover { background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
	.dl-btn a { text-decoration: none; }

	.answer-section { align-items: stretch; }
	.answer-section .check-btn {
		background: #1f6feb;
		color: #fff;
		border: none;
		padding: 0.45rem 0.75rem;
		border-radius: 8px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background .2s ease;
	}
	.answer-section .check-btn:hover { background: #1559c4; }

	.answer-section .check-btn[disabled] {
		opacity: 0.6;
		cursor: not-allowed;
		background: #94bff7;
	}

	.feedback { margin: 0; font-weight: 600; }
	.feedback.correct { color: #1a7f37; }
	.feedback.wrong { color: #b91c1c; }
	.feedback.error { color: #b45309; }

	.attempts {
 		margin: 0;
 		font-size: 0.75rem;
 		color: #9ca3af; /* lighter muted gray */
 		font-weight: 400;
 		margin-top: 2px;
 		font-style: italic;
	}

	@media (max-width: 640px) {
		.cards-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.9rem; }
		.image-box { aspect-ratio: 1 / 1; }
	}

	

	.card-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		max-width: max-content;
	}

	card{
		box-sizing: border-box;
		width: 200px;
		height: 200px;
		border: none;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		border-radius: 12px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		position: relative;
		color: black;
		max-width: 80%;
	}

	

	.download-link a {
		text-decoration: none;
		font-size: 1.4rem;
		position: absolute;
		bottom: 30%;
    	right: 5%;
	}

	

	@keyframes pulse {
		0% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(238, 14, 14, 0.7);
		}
		70% {
			transform: scale(1);
			box-shadow: 0 0 0 7px rgba(217, 8, 8, 0.532);
		}
		100% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(240, 11, 11, 0.26);
		}
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
