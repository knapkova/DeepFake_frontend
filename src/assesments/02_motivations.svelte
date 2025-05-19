<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import ToggleSwitch from '$lib/toggle_switch.svelte';
	import type { ManipulativeTextComments, AssignmentManipulativeText } from '$types/interfaces';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import FbPost from '$components/FbPost.svelte';

	export let onLevelComplete: () => void = () => {};

	function completeLevel() {
		onLevelComplete();
	}

	const state = writable<'start' | 'emotions' | 'comments' | 'end'>('start');
	let showPostBody = false;

	let answersChecked = false;
	let error_message = '';

	const text_id = 32;
	const get_text =
		'/api/Admin/AssignmentManipulativeText/GetAssignmentManipulativeTextsById/' + text_id;

	let comments = writable<ManipulativeTextComments[]>([]);
	let text = writable<AssignmentManipulativeText | null>(null);

	let selectedMotivations: string[] = [];
	let answerResults: { correct: boolean; correctAnswer: number }[] = [];

	async function getText() {
		try {
			const response = await fetch(PUBLIC_VITE_API_ROOT + get_text, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
			});
			const data = await response.json();
			if (Array.isArray(data) ? data.length > 0 : data) {
				const record = Array.isArray(data) ? data[0] : data;
				text.set(record as AssignmentManipulativeText);
				comments.set(record.manipulativeComments);
				selectedMotivations = Array(record.manipulativeComments.length).fill('');
			}
		} catch (error) {
			console.error('Error fetching text:', error);
		}
	}

	let selectedSwitches: boolean[] = [];

	// when the text (and its motivations) arrive, init the array
	$: if ($text) {
		const len = $text.manipulativeMotivations.length;
		if (selectedSwitches.length !== len) {
			selectedSwitches = Array(len).fill(false);
		}
	}

	// count how many are on
	$: selectedCount = selectedSwitches.filter(Boolean).length;
	// allow proceed only when exactly two are on
	$: canProceed = selectedCount === 2;

	function toggleSwitch(i: number) {
		console.log('toggleSwitch', i);
		if (!selectedSwitches[i] && selectedCount >= 2) return;
		selectedSwitches[i] = !selectedSwitches[i];
	}

	onMount(getText);

	$: allSelected =
		$comments.length > 0 &&
		selectedMotivations.length === $comments.length &&
		selectedMotivations.every((v) => v !== '');

	function getMotivationById(id: number): string {
		return $text?.manipulativeMotivations.find((m) => m.id === id)?.motivation ?? '';
	}

	function checkAnswers() {
		if (!allSelected) {
			error_message = 'Některé komentáře zůstaly bez odpovědi.';
			return;
		}
		error_message = '';

		answersChecked = true;
		answerResults = $comments.map((comment, i) => {
			const chosen = parseInt(selectedMotivations[i]);
			return {
				correct: chosen === comment.manipulativeMotivationId,
				correctAnswer: comment.manipulativeMotivationId
			};
		});
	}
</script>

<div class="container" in:fly={{ x: 300, duration: 400 }} out:fly={{ x: -300, duration: 400 }}>
	{#if $state === 'start'}
		{#if $text}
			<div class="post-card">
				<div class="post-header">
					<span class="post-time">📅 Před chvílí</span>

					<h4 class="post-title">{$text.instructions}</h4>
				</div>

				<button on:click={() => (showPostBody = !showPostBody)} type="button">
					{showPostBody ? 'Skrýt příspěvek' : 'Zobrazit příspěvek'}
				</button>

				{#if showPostBody}
					<FbPost />
				{/if}
			</div>
			<div class="emotion-grid">
				{#each $text.manipulativeMotivations as motivation, i}
					<div class="emotion-card">
						<span class="info-button">
							ℹ️<span class="tooltip">{motivation.definition}</span>
						</span>
						<h4>
							{motivation.motivation}
						</h4>
						<ToggleSwitch
							checked={selectedSwitches[i]}
							disabled={!selectedSwitches[i] && selectedCount >= 2}
							onChange={() => toggleSwitch(i)}
						/>
					</div>
				{/each}
			</div>

			{#if canProceed}
				<div class="continue-wrapper">
					<button on:click={() => state.set('comments')}> Pokračovat 📸 </button>
				</div>
			{/if}
		{:else}
			<p>Načítání příspěvku...</p>
		{/if}
	{:else if $state === 'emotions'}
		<div class="emotion-section">
			<button on:click={() => state.set('comments')}> Pokračovat </button>
		</div>
	{:else if $state === 'comments'}
		<div class="post">
			<div class="post-header">
				<h3>💬 Komentáře: Jaké manipulativní techniky poznáváte?</h3>
				<p>U každého z komentářů rozklikni seznam a jednu vyber 🔎</p>
			</div>
		</div>

		{#if $comments.length}
			<div class="card">
				<div class="comments">
					{#each $comments as comment, i}
						<div class="comment-card">
							<div class="comment-react">
								<button>
									<svg
										fill="none"
										viewBox="0 0 24 24"
										height="16"
										width="16"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fill="#707277"
											stroke-linecap="round"
											stroke-width="2"
											stroke="#707277"
											d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
										></path>
									</svg>
								</button>
								<hr />
								<span> {Math.floor(Math.random() * 500)}</span>
							</div>

							<div class="comment-container">
								<div class="user">
									<div class="user-pic">
										<svg
											fill="none"
											viewBox="0 0 24 24"
											height="20"
											width="20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linejoin="round"
												fill="#707277"
												stroke-linecap="round"
												stroke-width="2"
												stroke="#707277"
												d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
											></path>
											<path
												stroke-width="2"
												fill="#707277"
												stroke="#707277"
												d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
											></path>
										</svg>
									</div>
									<div class="user-info">
										<span>{comment.username}</span>
										<p>Před {Math.floor(Math.random() * 60)} min</p>
									</div>
								</div>
								<hr class="solid" />
								<div class="comment-content">
									<p class="comment-content">
										{comment.comment}
									</p>
								</div>
								<div class="motivation-select">
								<select bind:value={selectedMotivations[i]}>
									<option value="" disabled selected>-- Vyberte z motivací --</option>
									{#each $text?.manipulativeMotivations ?? [] as motivation}
										<option value={motivation.id}>{motivation.motivation}</option>
									{/each}
								</select>
							</div>
							{#if answerResults[i] !== undefined}
								{#if answerResults[i].correct}
									<p class="result correct">Správně!</p>
								{:else}
									<p class="result incorrect">
										{getMotivationById(answerResults[i].correctAnswer)}<br />
										{#if comment.manipulativeExplanation}
											{comment.manipulativeExplanation}
										{/if}
									</p>
								{/if}
							{/if}
							</div>
							
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p>Načítání komentářů...</p>
		{/if}
		{#if error_message}
			<p
				class="error-message"
				in:fly={{ x: 300, duration: 400 }}
				out:fly={{ x: -300, duration: 400 }}
			>
				{error_message}
			</p>
		{/if}
		<button on:click={checkAnswers} hidden={answersChecked}> Zkontrolovat odpovědi 📝 </button>
		<button on:click={() => completeLevel()} hidden={!answersChecked}> Jdu dál </button>
	{/if}
</div>

<style>
	@keyframes popCorrect {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		60% {
			transform: scale(1.1);
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
	.error-message {
		margin: 0.5rem;
		color: #b91c1c;
		background-color: #fee2e2;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		animation: popCorrect 0.4s ease-out both;

		font-size: 0.9rem;
	}
	.comment-card {
		display: grid;
		grid-template-columns: 35px 1fr;
		gap: 20px;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 1rem;
	}
	.comments {
		display: flex;
		flex-direction: column;
		gap: 1rem; /* vertical space between cards */
		padding: 0;
		margin: 0;
	}

	.comment-react {
		width: 35px;
		height: fit-content;
		display: grid;
		grid-template-columns: auto;
		margin: 0;
		background-color: #f1f1f1;
		border-radius: 5px;
	}

	.comment-react button {
		width: 35px;
		height: 35px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		border: 0;
		outline: none;
	}

	.comment-react button:after {
		content: '';
		width: 40px;
		height: 40px;
		position: absolute;
		left: -2.5px;
		top: -2.5px;
		background-color: #f5356e;
		border-radius: 50%;
		z-index: 0;
		transform: scale(0);
	}

	.comment-react button svg {
		position: relative;
		z-index: 9;
	}

	.comment-react button:hover:after {
		animation: ripple 0.6s ease-in-out forwards;
	}

	.comment-react button:hover svg {
		fill: #f5356e;
	}

	.comment-react button:hover svg path {
		stroke: #f5356e;
		fill: #f5356e;
	}

	.comment-react hr {
		width: 80%;
		height: 1px;
		background-color: #dfe1e6;
		margin: auto;
		border: 0;
	}

	.comment-react span {
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto;
		font-size: 13px;
		font-weight: 600;
		color: #707277;
	}

	.comment-container {
		display: flex;
		flex-direction: column;
		gap: 15px;
		padding: 0;
		margin: 0;
	}

	.comment-container .user {
		display: grid;
		grid-template-columns: 40px 1fr;
		gap: 10px;
	}

	.comment-container .user .user-pic {
		width: 40px;
		height: 40px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f1f1f1;
		border-radius: 50%;
	}

	.comment-container .user .user-pic:after {
		content: '';
		width: 9px;
		height: 9px;
		position: absolute;
		right: 0px;
		bottom: 0px;
		border-radius: 50%;
		background-color: #0fc45a;
		border: 2px solid #ffffff;
	}

	.comment-container .user .user-info {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 3px;
	}

	.comment-container .user .user-info span {
		font-weight: 700;
		color: #47484b;
	}

	.comment-container .user .user-info p {
		font-weight: 600;
		font-size: 10px;
		color: #acaeb4;
	}

	.comment-container .comment-content {
		font-size: 12px;
		line-height: 16px;
		font-weight: 600;
		color: #5f6064;
	}

	@keyframes ripple {
		0% {
			transform: scale(0);
			opacity: 0.6;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	.continue-wrapper {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
	}

	.post-card {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 16px;
		padding: 1.5rem;
		margin: 1.5rem auto;
		max-width: 800px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.post-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
	}

	.post-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		border-bottom: 2px solid #d1d5db;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
		gap: 0.5rem;
		flex-direction: column;
	}

	.post-title {
		margin: 0;
	}
	hr.solid {
		border-top: 3px solid #bbb;
	}

	.post-time {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.container {
		font-family: 'Inter', sans-serif;
		background: #f5f7fa;
		color: #333;
		padding: 1rem;
		max-width: none;
		width: 95%;
		padding: 1rem;
		display: flex;
		margin: 2rem auto;
		flex-direction: column;
	}

	.post,
	.comment-card,
	.emotion-card {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.2s ease;
		padding: 1.5rem;
	}
	.post:hover,
	.comment-card:hover,
	.emotion-card:hover {
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
	}

	.emotion-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13%, 1fr));
		gap: 1rem;
		margin: 1.5rem;
	}

	.info-button {
		position: relative;
		display: inline-block;
		background: #e5e7eb;
		border-radius: 50%;
		width: 1.2rem;
		height: 1.2rem;
		font-size: 0.75rem;
		text-align: center;
		line-height: 1.2rem;
		margin-left: 0.5rem;
		cursor: pointer;
		transition: background 0.2s;
	}
	.info-button:hover {
		background: #a09ade;
		color: #fff;
	}

	.tooltip {
		display: none;
		position: absolute;
		top: 120%;
		left: 50%;
		transform: translateX(-50%);
		background: #aaa7d8;
		color: #fff;
		padding: 0.5rem;
		font-size: 0.75rem;
		border-radius: 6px;
		white-space: normal;
		z-index: 10;
	}
	.info-button:hover .tooltip {
		display: block;
	}
	.motivation-select {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.motivation-select select {
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid hsl(220, 13%, 91%);
		border-radius: 6px;
		width: 100%;
		margin-top: 1rem;
	}

	.result {
		margin-top: 0.5rem;
		padding: 0.5rem;
		border-radius: 4px;
		font-weight: normal;
		line-height: 1.4;
		animation: popCorrect 0.4s ease-out both;
	}

	.result.correct {
		color: #276749; /* softer green */
		background-color: #f0fff4; /* very light mint */
		animation: popCorrect 0.4s ease-out both;
	}

	.result.incorrect {
		color: #742a2a; /* softer red */
		background-color: #fff5f5; /* very light rose */
		animation: popCorrect 0.4s ease-out both;
	}
	@media (max-width: 768px) {
		.card {
			width: 100%;
			align-self: center;
		}
		.emotion-grid {
			display: flow;
		}
		.motivation-select select {
			width: 100%;
			        font-size: small;
		}
		.comment-container {
			    font-size: small;
		}
		.comment-card {
			gap: 10px;
		}
	}
</style>
