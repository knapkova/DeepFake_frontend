<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import { writable } from 'svelte/store';
	import type { AssignmentIntroductionArticle, StartQuiz } from '$types/interfaces';
	//import DndConditional from '$lib/dnd_conditional_fr_now.svelte';
	import DndConditional from '$lib/dnd_intro.svelte';

	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut, backOut } from 'svelte/easing';
	import Wheel from '$components/Wheel.svelte';

	let loading = true;
	let progress = 0;
	const DURATION = 20000;

	export let onLevelComplete: () => void = () => {};

	// Call this function when the level is ready to complete.
	function completeLevel() {
		onLevelComplete();
	}

	let quizCompleted = false;

	// Example emoji positions (left and top in pixels)

	let wheelSelected = false;

	const state = writable<'start' | 'emotions' | 'quiz' | 'end'>('start');

	const article_id = 6;
	let article = writable<AssignmentIntroductionArticle[]>([]);
	let quiz = writable<StartQuiz[]>([]);
	const get_req =
		'/api/Admin/AssignmentIntroductionArticle/GetAssignmentIntroductionArticlesById/' + article_id;

	onMount(() => {
		fetchArticle().then((data) => {
			article.set(data);
			if (data.length > 0) {
				// Extract the quiz questions from the article and update the quiz store.
				quiz.set(data[0].questions);
			}
		});

		const start = performance.now();
		function tick(now: number) {
			const elapsed = now - start;
			progress = Math.min(100, (elapsed / DURATION) * 100);
			if (elapsed < DURATION) {
				requestAnimationFrame(tick);
			} else {
				loading = false;
			}
		}
		requestAnimationFrame(tick);
	});

	async function fetchArticle() {
		const response = await fetch(PUBLIC_VITE_API_ROOT + get_req, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const data = await response.json();
		console.log('data', data);
		const fetchedArticle: AssignmentIntroductionArticle[] = Array.isArray(data) ? data : [data];
		return fetchedArticle;
	}
</script>

{#if $state === 'start'}
	<div class="fb-post" in:fly={{ x: 300, duration: 400 }} out:fly={{ x: -300, duration: 400 }}>
		<!-- post header -->

		{#if $article.length > 0}
			<div class="fb-header">
				<img class="fb-avatar" src="/profile_pic_ivan.png" alt="User avatar" />
				<div class="fb-user-info">
					<span class="fb-name">{$article[0].title}</span>
					<span class="fb-time">před minutou</span>
				</div>
				<div class="fb-options">⋯</div>
			</div>
			<div class="fb-content">
				{@html $article[0].content}
			</div>
			{#if $article[0].imgSrc}
				<img src={$article[0].imgSrc} alt="" class="fb-media" />
			{/if}
			<p class="fb-instructions">
				{$article[0].Instructions}
			</p>
			<div class="fb-actions">
				<div class="fb-action-buttons">
					<button class="fb-action-btn">👍 Reagovat</button>
					<button class="fb-action-btn">💬 Komentáře (143)</button>
					<button class="fb-action-btn">🔄 Sdílet</button>
				</div>
			</div>
		{:else}
			<p>Načítám článek…</p>
		{/if}

		<button class="fb-button" on:click={() => state.set('emotions')} disabled={loading}>
			{#if loading}
				<!-- fill bar behind the text -->
				<div class="fill-bar" style="width: {progress}%"></div>
				<span class="btn-text">Načítám…</span>
			{:else}
				<span class="btn-text">Pokračovat</span>
			{/if}
		</button>
	</div>
{/if}

{#if $state === 'emotions'}
	<div class="emotions-layout" in:fly={{ x: 300, duration: 400 }} out:fly={{ x: -300 }}>
		<div class="emoji-box">
			<p class="emoji-box-title">
				Příspěvek strhl vlnu emocí. Jaké emoce myslíš, že takový příspěvek v lidech nejspíš vyvolá? <b
					>Kliknutím na kolo vyber 3 nejsilnější emoce.</b
				> Můžeš si také udělat screen ze své odpovědi.
			</p>

			<Wheel bind:wheelSelected />

			{#if wheelSelected}
				<div class="continue-container">
					<button on:click={() => state.set('quiz')}> Pokračovat </button>
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if $state === 'quiz'}
	<div class="quiz-container" in:fly={{ x: 300, duration: 400 }} out:fly={{ x: -300 }}>
		<div class="quiz-header">
			<h2>Slovník</h2>
			<p>Ještě než se ponoříme do příběhu, přiřaď správné definice k pojmům z článku.</p>
		</div>
		<DndConditional
			{quiz}
			onQuizComplete={() => {
				quizCompleted = true;
			}}
		/>
		{#if quizCompleted}
			<div class="continue-container">
				<h2>Vše přiřazeno!</h2>
				<button on:click={() => completeLevel()}>Jdeme dál! ✅</button>

				<!--<button on:click={() => state.set('end')}>Jdeme dál! ✅</button>-->
			</div>
		{:else}
			<div class="quiz-in-progress">
				<p>...</p>
			</div>
		{/if}
	</div>
{/if}

{#if $state === 'end'}
	<div class="end" in:fly={{ y: 200, duration: 500, easing: backOut }}>
		<h2>🎉 gratulace!</h2>
		<p>Hotovson</p>
		<button on:click={() => completeLevel()}>Jsem ready jít dál</button>
	</div>
{/if}

<style>
	.quiz-container p {
		font-size: 0.9rem;
	}

	.quiz-header{
		padding: 12px 16px;
		background: #f7f7f7;
		border-bottom: 1px solid #eee;
	}
	.continue-container {
		display: flex;
		justify-content: center;
		margin-top: 1.5rem;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
	}
	.fb-actions {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		border-top: 1px solid #ddd;
		padding: 8px 12px;
		background: #fafafa;
		flex-direction: column;
	}

	.fb-action-buttons {
		display: flex;
		flex: 1;
		justify-content: space-evenly;
	}
	.fb-action-btn {
		background: none;
		border: none;
		margin: 0 0.5rem;
		background: rgba(0, 0, 0, 0.026);
		color: #65676b;
		font-size: 0.8rem;
		display: flex;
		align-items: center;
		padding: 6px 8px;
		border-radius: 4px;
		cursor: pointer;
		box-shadow: none !important;
	}
	.fb-action-btn:hover {
		background: rgba(0, 0, 0, 0.05) !important;
		box-shadow: none !important;
	}
	.fb-post {
		max-width: 500px;
		margin: 1rem auto;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		font-family: Helvetica, Arial, sans-serif;
		color: #1c1e21;
		overflow: hidden;
	}

	.fb-header {
		display: flex;
		align-items: center;
		padding: 12px;
	}
	.fb-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 8px;
	}
	.fb-user-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}
	.fb-name {
		font-weight: bold;
		font-size: 14px;
	}
	.fb-time {
		font-size: 12px;
		color: #65676b;
	}
	.fb-options {
		font-size: 20px;
		color: #65676b;
		cursor: pointer;
	}

	.fb-content {
		margin: 8px 12px;
		font-size: 0.7rem;
		line-height: 1.4;
	}
	.fb-media {
		width: 100%;
		display: block;
		margin-top: 8px;
	}
	.fb-instructions {
		margin: 8px 12px 0;
		font-size: 13px;
		color: #65676b;
	}

	.fb-button {
		position: relative;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: calc(100% - 24px);
		margin: 12px;
		padding: 8px 0;
		background: #8b513e;
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.fb-button:disabled {
		opacity: 0.7;
		cursor: default;
	}

	.fill-bar {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.3);
		z-index: 1;
		/* width driven by inline style */
	}

	.btn-text {
		position: relative;
		z-index: 2;
	}

	.emoji-box {
		position: relative;
		margin: 2rem auto;
		padding: 1rem;
		max-width: 100rem;
		background: #ffffff;
		border: 2px dashed #ccc;
		border-radius: 16px;
	}

	.emoji-box-title {
		margin-bottom: 10px;
		text-align: center;
		color: #333;
	}

	.emotions-layout {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap; /* ensures responsiveness on small screens */
		margin: 2rem 1rem;
	}

	.quiz-container {
		margin: 2rem auto;
	}
</style>
