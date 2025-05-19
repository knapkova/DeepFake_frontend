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
		nickname.set('@' + localNickname);
		showInput = false; // Hide the input after saving.
		// Any additional actions can be performed here.
	}

	const options = [
		{ title: '🔍 První zpráva', lvl: 'Level 1' },
		{ title: '🧩 Kdo a proč?', lvl: 'Level 2' },
		{ title: '📷 Důkazy pod lupou', lvl: 'Level 3' },
		{ title: '🧠 Proč tomu lidé věří?', lvl: 'Level 4' },
		{ title: '🎭 Závěrečný kvíz', lvl: 'Level 5' }
	];

	let progress = writable(97);
</script>

<main class="introduction-window">
  <div class="intro-container">
    <div class="intro-text">
      <h3>Pomož odhalit pravdu</h3>
      <h1>MarsGate</h1>
      <p>
        Země se ocitla na pokraji ekologického kolapsu a společnost se potácí v nejistotě.
        Sociální sítě ovládají spekulace, deepfake a konspirační teorie.
      </p>
    </div>
    <div class="intro-image">
      <img src="/mars-earth.jpg" alt="Mars and Earth" />
    </div>
  </div>
	<Hr classHr="my-8" />

	<div class="mt-10 grid grid-cols-1 gap-10 text-sm md:grid-cols-2">
		<div>
			<Hr classHr="w-48 h-1 mx-auto my-4 rounded-sm md:my-10" />

			<h2 class="mb-2 text-2xl font-bold">Co tě čeká?</h2>
			<Timeline position="alternate">
				{#each options as option}
					<TimelineItem>
						<TimelineOppositeContent slot="opposite-content">
							<p>{option.lvl}</p>
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineDot />
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent>
							<h3>{option.title}</h3>
						</TimelineContent>
					</TimelineItem>
				{/each}
			</Timeline>
		</div>
		<div>
			<Hr classHr="w-48 h-1 mx-auto my-4 rounded-sm md:my-10" />
			<div class="intro-part">
				<h2 class="mb-2 text-2xl font-bold">Jaký je tvůj cíl?</h2>
				<div
					class="progress-container relative h-6 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
				>
					<ProgressBar {progress} />
				</div>
				<h3>Míra chaosu ve společnosti</h3>
				<p>
					Tento ukazatel znázorňuje, kolik lidí je stále ztraceno v informačním chaosu a nevěří už
					vůbec ničemu. S každým splněným levelem pomáháš více a více lidem orientovat se ve světě
					dezinformací a obnovovat důvěru ve fakta.
				</p>
				<button
					onclick={() => {
						if ($progress < 40) {
							progress.set(97);
						} else {
							progress.set($progress - 20);
						}
					}}>Vyzkoušej zde 👈</button
				>
			</div>
			{#if showInput}
				<div class="intro-part">
					<h3 class="mb-2 font-semibold">Zvol si <s>info</s> svoji přezdívku</h3>
					<input
						type="text"
						placeholder="Zadej jméno"
						class="input mb-4 w-full"
						bind:value={localNickname}
						required
					/>
					<button type="submit" onclick={saveNickname} disabled={!localNickname}>
						Uložit a pokračovat do hry
					</button>
				</div>
			{/if}

			{#if !showInput}
				<div class="mt-20 flex items-center justify-end gap-4">
					<div class="text-right">
						<div class="text-lg font-bold">Jdeme na to, {$nickname}</div>
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
	.introduction-window {
    min-height: 100vh;
    padding: 2.5rem;              /* formerly p-10 */
    font-family: system-ui, sans-serif;
    color: #1a202c;               /* formerly text-gray-900 */
  }

  .intro-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .intro-text {
    flex: 1;
  }

  .intro-text h3 {
    font-size: 0.875rem;          /* text-sm */
    font-weight: 600;             /* font-semibold */
    text-transform: uppercase;
    color: #718096;               /* text-gray-500 */
    margin: 0;
  }

  

  .intro-text p {
    margin-top: 1.5rem;           /* mt-6 */
    max-width: 48rem;             /* max-w-3xl */
    font-size: 1.125rem;          /* text-lg */
    color: #4a5568;               /* text-gray-700 */
    line-height: 1.6;
  }

  .intro-image img {
    max-width: 80%;
    height: auto;
    display: block;
    object-fit: cover;
  }
	.intro-part {
		padding: 20px;
    margin: 10px;
    display: flex
;
    width: 100%;
    /* box-shadow: 3px 4px 3px 5px rgba(0, 0, 0, 0.2); */
    flex-direction: column;
	}	
	</style>
