<script lang="ts">
import RangeSlider from 'svelte-range-slider-pips'
import { onMount } from 'svelte';
import {writable} from 'svelte/store';
import type {ManipulativeTextComments, AssignmentManipulativeText} from "../types/interfaces"
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

const state = writable<'start' | 'emotions' | 'comments' | 'end'>('start');

const text_id = 32;
const get_text = "/api/Admin/AssignmentManipulativeText/GetAssignmentManipulativeTextsById/" + text_id

let comments = writable<ManipulativeTextComments[]>([]);
let text = writable<AssignmentManipulativeText | null>(null);


async function getText() {
  try{
      const response = await fetch(PUBLIC_VITE_API_ROOT + get_text, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
          },
      });
      const data = await response.json();
      console.log("Fetched text data:", data);
      
      // Check if the response is an array or a single object.
      if (Array.isArray(data)) {
        if (data.length > 0) {
          text.set(data[0] as AssignmentManipulativeText);
          comments.set(data[0].manipulativeComments);
        }
      } else if (data) {
        text.set(data as AssignmentManipulativeText);
        comments.set(data.manipulativeComments);
      }
    } catch (error) {
      console.error("Error fetching text:", error);
    }
  }

onMount(() => {
  
  getText()
});
</script> 

{#if $state === 'start'}
  {#if $text}
    <div class="post">
      <div class="post-header">
        <h3>{$text.instructions}</h3>
        <span class="post-time">📅 Před chvílí</span>
      </div>
      <div class="post-body">
        <p>{$text.assignmentIntroductionArticle.content}</p>
      </div>
    </div>
    <div class="emotion-grid">
      {#each $text.manipulativeMotivations as motivation }
        <div>
          <h4>
            {motivation.motivation}
            <span class="info-button">
              ℹ️
              <span class="tooltip">{motivation.definition}</span>
            </span>
          </h4>
          <RangeSlider value={50} />
        </div>
      {/each}
    </div>

    <button on:click={() => state.set('emotions')} class="glow-on-hover" type="button">
      Pokračovat
    </button>
  {:else}
    <p>Načítání příspěvku...</p>
  {/if}


{:else if $state === 'emotions'}
  
<div class="emotion-section">
  <button on:click={() => state.set('comments')} class="glow-on-hover" type="button">
    Pokračovat
  </button>
</div>

{:else if $state === 'comments'}
  <div class="post">
    <div class="post-header">
      <h3>💬 Komentáře</h3>
      <span class="post-time">📅 Před chvílí</span>
    </div>
  </div>

  {#if $comments.length}
  <h3 class="comments-title">💬 Komentáře: Jaké manipulativní techniky poznáváte?</h3>
  <div class="comments-container">
    {#each $comments as comment}
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
        <div>
          <select>
            {#each $text?.manipulativeMotivations ?? [] as motivation}
              <option value={motivation.id}>{motivation.motivation}</option>
            {/each}
          </select>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <p>Načítání komentářů...</p>
{/if}
<button on:click={() => state.set('start')} class="glow-on-hover" type="button">
  Pokračovat
</button>
{/if}




<style>
  .post {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .post-body {
    margin-top: 1rem;
    font-size: 1.1rem;
  }

  .post-time {
    font-size: 0.85rem;
    color: #888;
  }

  .comments-title {
    margin-top: 2rem;
    font-size: 1.2rem;
  }

  .comments-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .comment-card {
    display: flex;
    padding: 1rem;
    border-radius: 10px;
    background-color: #f1f1f1;
  }

  .profile-photo {
    width: 50px;
    height: 50px;
    background-color: #ccc;
    border-radius: 50%;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
  }

  .comment-content {
    flex: 1;
  }

  .comment-username {
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  .comment-text {
    margin: 0.2rem 0 0.5rem;
  }

  .comment-reactions {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: #666;
  }

  .emotion-section {
    margin-top: 2rem;
  }

  .emotion-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .info-button {
  display: inline-block;
  background-color: #eee;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  text-align: center;
  font-size: 12px;
  line-height: 16px;
  margin-left: 0.5rem;
  position: relative;
  cursor: pointer;
}

.info-button .tooltip {
  display: none;
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 4px 6px;
  font-size: 0.8rem;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 10;
}

.info-button:hover .tooltip {
  display: block;
}
</style>