<script lang="ts">
  import { onMount } from 'svelte';
  import { writable, get } from 'svelte/store';
  import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

  interface AssignmentFindPictureSource {
    id: number;
    imgSrc: string;
    imgTitle: string;
    matched?: boolean;
  }

  let category_id = 10;
  const api_get_by_category = "/api/Admin/AssignmentFindPictureSource/GetAssignmentFindPictureSourcesByCategoryId/";

  let originalSources = writable<AssignmentFindPictureSource[]>([]);
  let imageItems: AssignmentFindPictureSource[] = [];
  let titleItems: AssignmentFindPictureSource[] = [];

  // Using indices to track the selection per column
  let selectedImageIndex: number | null = null;
  let selectedTitleIndex: number | null = null;

  type GameState = 'start' | 'play' | 'done';
  let state: GameState = 'start';

  onMount(async () => {
    const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_get_by_category}${category_id}`);
    const data = await response.json();
    originalSources.set(data);
  });

  function startGame() {
    state = 'play';
    const sources = [...get(originalSources)];
    sources.forEach(item => (item.matched = false));
    imageItems = shuffle([...sources]);
    titleItems = shuffle([...sources]);
    selectedImageIndex = null;
    selectedTitleIndex = null;
  }

  function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Only one image can be selected at a time.
  function toggleImage(index: number) {
    if (selectedImageIndex === index) {
      selectedImageIndex = null;
    } else {
      selectedImageIndex = index;
    }
  }

  // Only one title can be selected at a time.
  function toggleTitle(index: number) {
    if (selectedTitleIndex === index) {
      selectedTitleIndex = null;
    } else {
      selectedTitleIndex = index;
    }
  }
</script>

<h2>Najdi zdroj k obrázku (Matching Game)</h2>

{#if state === 'start'}
  <button on:click={startGame}>Začít hru</button>
{:else if state === 'play'}
  <p>Vyberte obrázek a poté odpovídající text.</p>
  <div class="row">
    <!-- Images -->
    <div class="column">
      <h3>Obrázky</h3>
      {#each imageItems as img, i}
        <button
          type="button"
          class="card {selectedImageIndex === i ? 'selected' : ''}"
          on:click={() => toggleImage(i)}
        >
          <img src={img.imgSrc} alt="Obrázek" />
        </button>
      {/each}
    </div>

    <!-- Titles -->
    <div class="column">
      <h3>Názvy</h3>
      {#each titleItems as txt, i}
        <button
          type="button"
          class="card {selectedTitleIndex === i ? 'selected' : ''}"
          on:click={() => toggleTitle(i)}
        >
          {txt.imgTitle}
        </button>
      {/each}
    </div>
  </div>
{:else if state === 'done'}
  <p>Všechny páry byly úspěšně spárovány!</p>
  <button on:click={startGame}>Hrát znovu</button>
{/if}

<style>
  .row {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 200px;
    align-items: center;
  }

  /* Basic button styles for .card */
  button.card {
    box-sizing: border-box;
    width: 180px;
    height: 180px;
    border: 1px solid #ccc;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s;
    user-select: none;
  }

  button.card:hover {
    background-color: #f0f0f0;
  }

  /* When selected, change the background and border */
  button.card.selected {
    background-color: rgba(255, 0, 13, 0.597);
    color: white;
    border: 3px solid #ff00086e;
  }

  .card img {
    max-width: 100%;
    max-height: 100%;
    pointer-events: none;
  }
</style>
