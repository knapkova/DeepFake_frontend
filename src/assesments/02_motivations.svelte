<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import ToggleSwitch from '$lib/toggle_switch.svelte';
  import type { ManipulativeTextComments, AssignmentManipulativeText } from '../types/interfaces';
  import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
  
  export let onLevelComplete: () => void = () => {};

  function completeLevel() {
    onLevelComplete();
  }

  const state = writable<'start' | 'emotions' | 'comments' | 'end'>('start');
  let showPostBody = false;

  let answersChecked = false;
  
  const text_id = 32;
  const get_text = "/api/Admin/AssignmentManipulativeText/GetAssignmentManipulativeTextsById/" + text_id;
  
  let comments = writable<ManipulativeTextComments[]>([]);
  let text = writable<AssignmentManipulativeText | null>(null);
  
  let selectedMotivations: string[] = [];
  let answerResults: { correct: boolean; correctAnswer: number }[] = [];
  
  async function getText() {
    try {
      const response = await fetch(PUBLIC_VITE_API_ROOT + get_text, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
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

  let selectedSwitches: boolean[]= [];

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
  
  $: allSelected = $comments.length > 0 && selectedMotivations.length === $comments.length && selectedMotivations.every(v => v !== '');
  
  function getMotivationById(id: number): string {
    return $text?.manipulativeMotivations.find(m => m.id === id)?.motivation ?? '';
  }
  
  function checkAnswers() {
    answersChecked = true;
    answerResults = $comments.map((comment, i) => {
      const chosen = parseInt(selectedMotivations[i]);
      return { correct: chosen === comment.manipulativeMotivationId, correctAnswer: comment.manipulativeMotivationId };
    });
  }
  </script>
  
  <div class="container">
    {#if $state === 'start'}
  {#if $text}
    <div class="post-card">
      <div class="post-header">
        <span class="post-time">📅 Před chvílí</span>

        <h3 class="post-title">{$text.instructions}</h3>
      </div>
      
      <button 
        on:click={() => showPostBody = !showPostBody} 
        class="toggle-btn" 
        type="button">
        {showPostBody ? 'Skrýt příspěvek' : 'Zobrazit příspěvek'}
      </button>
      
      {#if showPostBody}
        <div class="post-body">
          <h4 class="body-title">{$text.assignmentIntroductionArticle.title}</h4>
          <p class="body-content">{$text.assignmentIntroductionArticle.content}</p>
        </div>
      {/if}
    </div>
        <div class="emotion-grid">
          {#each $text.manipulativeMotivations as motivation, i}
            <div class="emotion-card">
              <h4>
                
                <span class="info-button">
                  ℹ️<span class="tooltip">{motivation.definition}</span>
                </span>
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
            <button on:click={() => state.set('comments')} class="btn continue-btn">
              Pokračovat 📸
            </button>
          </div>
        {/if}

      {:else}
        <p>Načítání příspěvku...</p>
      {/if}
  
    {:else if $state === 'emotions'}
      <div class="emotion-section">
        <button on:click={() => state.set('comments')} class="btn">
          Pokračovat
        </button>
      </div>
  
    {:else if $state === 'comments'}
      <div class="post">
        <div class="post-header">
          <h3>💬 Komentáře: Jaké manipulativní techniky poznáváte?</h3>
          <span class="post-time">📅 Před chvílí</span>
        </div>
      </div>
  
      {#if $comments.length}
        <div class="comments-container">
          {#each $comments as comment, i}
            <div class="comment-card">
              <div class="profile-photo">🤥</div>
              <div class="comment-content">
                <h4 class="comment-username">{comment.username}</h4>
                <p class="comment-text">{comment.comment}</p>
                <div class="comment-reactions">
                  <span>👍 {Math.floor(Math.random() * 500)}</span>
                  <span>❤️ {Math.floor(Math.random() * 300)}</span>
                  <span>😂 {Math.floor(Math.random() * 200)}</span>
                  <span>😡 {Math.floor(Math.random() * 30)}</span>
                  <span>💬 {Math.floor(Math.random() * 50)} odpovědí</span>
                </div>
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
                    Správná odpověď: {getMotivationById(answerResults[i].correctAnswer)}<br />
                    <i>?</i> {comment.manipulativeExplanation}
                  </p>
                {/if}
              {/if}
            </div>
          {/each}
          <button on:click={checkAnswers} disabled={!allSelected} hidden={answersChecked}
            class="btn">
            Zkontrolovat odpovědi 📝
          </button>
          <button
      on:click={() => completeLevel()}
      class="btn"
      hidden={!answersChecked}>
      Jdu dál
    </button>
        </div>
      {:else}
        <p>Načítání komentářů...</p>
      {/if}
  
      
      
    {/if}
  </div>
  
  <style>

    /* center the continue button */
  .continue-wrapper {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }

  /* make the button larger and more prominent */
  .btn.continue-btn {
    padding: 0.75rem 2rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 9999px;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .btn.continue-btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  .btn.continue-btn:disabled {
    background: #a5b4fc;
    cursor: not-allowed;
    transform: none;
  }
  
    /* Post Card Styling */
.post-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1.5rem auto;
  max-width: 800px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
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
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.post-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.toggle-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 1rem;
}

.toggle-btn:hover {
  background: #1e40af;
}

.post-body {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.body-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #374151;
  margin-bottom: 0.5rem;
}

.body-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
}
    
  .container {
    font-family: 'Inter', sans-serif;
    background: #f5f7fa;
    color: #333;
    padding: 1rem;
    max-width: none;
  width: 95%;
  padding: 1rem;
  margin: 2rem auto;
  }
  
  .post, .comment-card, .emotion-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: box-shadow 0.2s ease;
    padding: 1.5rem;
  }
  .post:hover, .comment-card:hover, .emotion-card:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  }
  
  .post-header h3, .comments-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }
  .post-time {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .post-body p, .comment-text {
    line-height: 1.6;
    margin: 1rem 0 0;
  }
 
  
  .secondary {
    background: #6b7280;
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
    background: #4338ca;
    color: #fff;
  }
  
  .tooltip {
    display: none;
    position: absolute;
    top: 120%;
    left: 50%;
    transform: translateX(-50%);
    background: #4f46e5;
    color: #fff;
    padding: 0.5rem;
    font-size: 0.75rem;
    border-radius: 6px;
    white-space: nowrap;
    z-index: 10;
  }
  .info-button:hover .tooltip {
    display: block;
  }
  
  .comments-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .profile-photo {
    width: 50px;
    height: 50px;
    background: #ccc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-right: 1rem;
  }
  
  .comment-content h4,
  .comment-content p {
    margin: 0;
  }
  
  .comment-reactions {
    display: flex;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }
  
  .motivation-select select {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid hsl(220, 13%, 91%);
    border-radius: 6px;
    width: 50%;
    margin-top: 1rem;
  }
  
  .result {
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    font-weight: normal;
    line-height: 1.4;
  }

  .result.correct {
    color: #276749;           /* softer green */
    background-color: #f0fff4; /* very light mint */
  }

  .result.incorrect {
    color: #742a2a;            /* softer red */
    background-color: #fff5f5; /* very light rose */
  }
  </style>
  