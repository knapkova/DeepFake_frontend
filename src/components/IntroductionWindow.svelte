<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { Hr } from 'flowbite-svelte';
    import ProgressBar from "$components/ProgressBar.svelte";
    import { writable } from 'svelte/store';

    

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
    state_game.update(n => n + 1);
  }
  let showInput = true;


  function persisted(key: string, init: string) {
    let initial: string;
    try {
      const raw = localStorage.getItem(key);
      initial = raw ? JSON.parse(raw) : init;
    } catch {
      initial = init;
    }
    const store = writable(initial);
    store.subscribe((v) => {
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        // ignore errors
      }
    });
    return store;
  }

  // Create a persistent store for the nickname.
  export let nickname = persisted('nickname', '');

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
		{ title: '🧩 Kdo a proč?',  lvl: 'Level 2'},
		{ title: '📷 Důkazy pod lupou',  lvl: 'Level 3'},
		{ title: '🧠 Proč tomu lidé věří?',  lvl: 'Level 4' },
        { title: '🎭 Závěrečný kvíz',  lvl: 'Level 5' }
	];

    let progress = writable(97);
    
  </script>
  
  <main class="p-10 bg-gray-100 min-h-screen text-gray-900 font-sans">
    <h3 class="text-sm uppercase font-semibold text-gray-500">Pomoc ohladit pravdu</h3>
    <h1 class="text-5xl font-bold mt-2">MarsGate</h1>
    <div class="flex flex-row items-center gap-4">
      
        <p class="mt-6 max-w-3xl text-lg text-gray-700">
          Země se ocitla na pokraji ekologického kolapsu a společnost se potácí v nejistotě. Sociální sítě ovládají spekulace, deepfake a konspirační teorie. 
        </p>
        <img src="/mars-earth.jpg" alt="Mars and Earth" width="40%"/>
      </div>
      <Hr classHr="my-8" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 text-sm">
      <div>
        <Hr classHr="w-48 h-1 mx-auto my-4 rounded-sm md:my-10" />

        <h2 class="font-bold text-2xl mb-2">Co tě čeká? </h2>
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

        <h2 class="font-bold text-2xl mb-2">Jaký je tvůj cíl?</h2>
        <div class="progress-container relative w-full bg-gray-200 rounded-full dark:bg-gray-700 h-6 overflow-hidden">
            <ProgressBar {progress} />
          </div>
        <p class="text-gray-700">
            <h3>Míra chaosu ve společnosti</h3> 
            <p>Tento ukazatel znázorňuje, kolik lidí je stále ztraceno v informačním chaosu a nevěří už vůbec ničemu.
            S každým splněným levelem pomáháš více a více lidem orientovat se ve světě dezinformací a obnovovat důvěru ve fakta.
                     </p>
                     <button onclick={() => { 
                        if ($progress < 20) {
                            progress.set(97);
        
                        }
                        else {
                          progress.set($progress - 20);
        
                        }
                    }} >Vyzkoušej zde 👈</button>  
                    {#if showInput}
                    <div class="mt-8">
                      <h3 class="font-semibold mb-2">Zvol si <s>info</s> svoji přezdívku</h3>
                      <input
                        type="text"
                        placeholder="Zadej jméno"
                        class="input w-full mb-4"
                        bind:value={localNickname}
                        required
                      />
                      <button
                        onclick={saveNickname}
                        disabled={!localNickname}
                      >
                        Uložit a pokračovat do hry
                    </button>
                    </div>
                  {/if}
            
                  {#if !showInput}
                  <div class="flex justify-end mt-20 items-center gap-4">
                    <div class="text-right">
                      <div class="font-bold text-lg">Jdeme na to, {$nickname}</div>
                    </div>
                    <button
                      onclick={incrementState}
                      aria-label="Start the game"
                      disabled={!$nickname}
                    >
                      ▶
                    </button>
                  </div>
                  {/if}
                </div>
                
  </main>
  