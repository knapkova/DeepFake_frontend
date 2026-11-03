<script lang="ts">
	import { Hr } from 'flowbite-svelte';
	import ProgressBar from '$components/ProgressBar.svelte';
	import { writable } from 'svelte/store';
	import { nickname } from '$stores/app';

	import {
		Timeline,
		TimelineItem,
		TimelineSeparator,
		TimelineDot,
		TimelineConnector,
		TimelineContent,
		TimelineOppositeContent
	} from 'svelte-vertical-timeline';

	export let state_game = writable(1);
	function incrementState() {
		state_game.update((n) => n + 1);
	}
	let showInput = true;

	// Create a persistent store for the nickname.

	// Use a local variable for binding.
	let localNickname = '';

	// When the component loads, initialize the input if a nickname was already saved.
	$: localNickname = $nickname;

	function saveNickname() {
		// Strip any '@' the player (or a previous save) already added, so it never doubles.
		nickname.set('@' + localNickname.trim().replace(/^@+/, ''));
		showInput = false; // Hide the input after saving.
		// Any additional actions can be performed here.
	}

	const options = [
		{ title: 'První zpráva', lvl: 'Level 1' },
		{ title: 'Kdo a proč?', lvl: 'Level 2' },
		{ title: 'Důkazy pod lupou', lvl: 'Level 3' },
		{ title: 'Proč tomu lidé věří?', lvl: 'Level 4' },
		{ title: 'Závěrečný kvíz', lvl: 'Level 5' }
	];

	let progress = writable(97);
</script>

<main class="introduction-window">
	<div class="intro-container">
		<div class="intro-text">
			<h1>MarsGate</h1>
			<p>
				Země se ocitla na pokraji ekologického kolapsu a společnost se potácí v nejistotě. Sociální
				sítě ovládají spekulace, deepfake a konspirační teorie.
			</p>
		</div>
		<div class="intro-image">
			<img src="/mars-earth.jpg" alt="Mars and Earth" />
		</div>
	</div>
	<Hr classHr="my-8" />

	<div class="content-grid">
		<div>
			<Hr classHr="w-48 h-1 mx-auto my-4 rounded-sm" />

			<h2 class="mb-2 text-2xl font-bold">Co tě čeká?</h2>
			<Timeline position="alternate">
				{#each options as option}
					<TimelineItem>
						<TimelineOppositeContent slot="opposite-content">
							<p class="level">{option.lvl}</p>
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineDot
				style={'background-color: #dc3545; border: solid 2px #dc3545; '}
			/>
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent>
							<h3 class="title">{option.title}</h3>
						</TimelineContent>
					</TimelineItem>
				{/each}
			</Timeline>
		</div>

		<div>
			<Hr classHr="w-48 h-1 mx-auto my-4 rounded-sm" />
			<div class="intro-part-column">
				<h2>Jaký je tvůj cíl?</h2>
				<h3>Míra chaosu ve společnosti</h3>

				<p>
					Tento ukazatel znázorňuje, kolik lidí je stále ztraceno v informačním chaosu a nevěří už
					vůbec ničemu. S každým splněným levelem pomáháš více a více lidem orientovat se ve světě
					dezinformací a obnovovat důvěru ve fakta.
				</p>
				<div class="intro-part-row">
					<div class="progress-container">
						<ProgressBar {progress} />
					</div>
					<button
						onclick={() => {
							if ($progress < 40) {
								progress.set(97);
							} else {
								progress.set($progress - 20);
							}
						}}
					>
						Vyzkoušej 👈
					</button>
				</div>
			</div>

			{#if showInput}
				<div class="intro-part-column">
					<h3>Zvol si <s>info</s> svoji přezdívku</h3>
					<div class="intro-part-row">
						<input
							type="text"
							placeholder="Zadej přezdívku"
							class="nickname-input"
							bind:value={localNickname}
							required
						/>
						<button type="submit" onclick={saveNickname} disabled={!localNickname.trim().replace(/^@+/, '')}> Uložit </button>
					</div>
				</div>
			{/if}

			{#if !showInput}
				<div class="ready-section">
					<div class="text-right">
						<div class="nickname-label">Jdeme na to, {$nickname}</div>
					</div>
					<button onclick={incrementState} aria-label="Start the game" disabled={!$nickname}>
						▶
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>

  .title{
    font-size: 1.2rem;
  }  

  .level{
    font-size: 0.9rem;
  }

	.introduction-window {
		min-height: 100vh;
		padding: 2.5rem;
		font-family: system-ui, sans-serif;
		color: #1a202c;
	}

	.intro-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.intro-text {
		flex: 1;
	}

	.intro-part-column h3 {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		color: #718096;
		margin: 0;
	}

	.intro-text p {
		margin-top: 1.5rem;
		max-width: 48rem;
		font-size: 1.125rem;
		color: #4a5568;
		line-height: 1.6;
	}

	.intro-image img {
		max-width: 80%;
		height: auto;
		display: block;
		object-fit: cover;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}

	@media (min-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr 1fr;
		}

		/* Make the left text wider and push the image to the right on larger screens */
		.intro-container {
			justify-content: flex-start; /* use gap for spacing */
			flex-wrap: nowrap; /* keep items on one line */
		}
		.intro-text {
			flex: 1 1 62%;
		}
		.intro-image {
			flex: 0 1 38%;
			display: flex;
			justify-content: flex-end; /* align image block to the right */
		}
		.intro-image img {
			max-width: 90%; /* allow a bit more size within the right column */
		}
	}

	.intro-part-column {
		margin: 10px 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.intro-part-row {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: center;
	}

	.progress-container {
		position: relative;
		height: 1.5rem;
		width: 100%;
		overflow: hidden;
		border-radius: 9999px;
		background-color: #e2e8f0;
	}

	.nickname-input {
		margin-bottom: 1rem;
		width: 100%;
		padding: 0.5rem;
	}

	.ready-section {
		margin-top: 5rem;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 1rem;
	}

	.nickname-label {
		font-size: 1.125rem;
		font-weight: bold;
	}

	@media (min-width: 768px) {
		.content-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 2.5rem;
			align-items: stretch;
		}
		.introduction-window {
			overflow-y: auto; /* page can scroll regardless of grid height */
		}

    .timeline-dot{
      background-color: red;
    }
	}
</style>
