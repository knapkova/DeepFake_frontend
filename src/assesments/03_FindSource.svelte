<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { writable, get } from 'svelte/store';
  import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import LensExplanationPopup from '$components/LensExplanation_popup.svelte';
  import LensPrequel from "$components/LensPrequel.svelte"
  import SortableList from '$components/sortable_list_lens.svelte'

  export let onLevelComplete: () => void = () => {};
  let showTutorial = writable(false);

  let sortFinished = false;
  function handleSortFinish(correct: boolean) {
    if (correct) {
      sortFinished = true;
      // tady dál reagujete na dokončení
    }
  }


  function completeLevel() {
    onLevelComplete();
  }

  interface AssignmentFindPictureSource {
    id: number;
    imgSrc: string;
    imgTitle: string;
    imgDescription: string;
  }

  let category_id = 10;
  const api_get_by_category = "/api/Admin/AssignmentFindPictureSource/GetAssignmentFindPictureSourcesByCategoryId/";

  let originalSources = writable<AssignmentFindPictureSource[]>([]);
  let imageItems: AssignmentFindPictureSource[] = [];
  let titleItems: AssignmentFindPictureSource[] = [];
  let completedPairs: { image: AssignmentFindPictureSource; title: AssignmentFindPictureSource }[] = [];

  // Using indices to track the selection per column
  let selectedImageIndex: number | null = null;
  let selectedTitleIndex: number | null = null;

  type GameState = 'start' | 'explain' | 'play' | 'done' | 'sorting';
  let state: GameState = 'start';

  let lensIntroComplete = false;

  async function handleLensIntroComplete() {
    await tick();
    await new Promise(resolve => setTimeout(resolve, 2000));

    lensIntroComplete = true;
  }


  onMount(async () => {
    const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_get_by_category}${category_id}`);
    const data = await response.json();
    originalSources.set(data);
  });

  function startGame() {
    state = 'play';
    const sources = [...get(originalSources)];
    imageItems = shuffle([...sources]);
    titleItems = shuffle([...sources]);
    completedPairs = [];
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

  function submitResults() {
    state = 'done';
  }

  // When both an image and title are selected, move them to the completedPairs
  function processPair() {
    if (selectedImageIndex == null || selectedTitleIndex == null) return;

    const selectedImage = imageItems[selectedImageIndex];
    const selectedTitle = titleItems[selectedTitleIndex];

    // Remove the selected items from the active arrays
    imageItems = imageItems.filter((_, i) => i !== selectedImageIndex);
    titleItems = titleItems.filter((_, i) => i !== selectedTitleIndex);

    // Add the selected pair to the completed list
    completedPairs = [...completedPairs, { image: selectedImage, title: selectedTitle }];

    // Reset selections so the user can choose a new pair
    selectedImageIndex = null;
    selectedTitleIndex = null;
  }

  // Only one image can be selected at a time.
  function toggleImage(index: number) {
    selectedImageIndex = selectedImageIndex === index ? null : index;
    if (selectedImageIndex != null && selectedTitleIndex != null) {
      processPair();
    }
  }

  // Only one title can be selected at a time.
  function toggleTitle(index: number) {
    selectedTitleIndex = selectedTitleIndex === index ? null : index;
    if (selectedImageIndex != null && selectedTitleIndex != null) {
      processPair();
    }
  }

</script>



<div class="container">
  <h2>Najdi zdroj k obrázku (Matching Game)</h2>
  <button  on:click={() => state = 'sorting'}>
    sorting
  </button>
  

  {#if state === 'start'}
 {#if lensIntroComplete}
     <p>
       Ivan přidává další materiály – několik fotografií, které podle něj
       dokazují, že přistání na Marsu už proběhlo. … Dokážeš o nich zjistit víc?
     </p>
     <button  on:click={() => state = 'explain'}>
      Jdu na to
    </button>
  {:else}
  <LensPrequel onComplete={handleLensIntroComplete}/>

  {/if}

  {:else if state == 'explain'}

    <LensExplanationPopup showLensExplanation={true}/>
    <button  on:click={startGame}>Začít hru</button>

  
  
  
  {:else if state === 'play'}
    <button  on:click={() => showTutorial.set(true)}>Google Lens návod</button>
    <LensExplanationPopup bind:showLensExplanation={$showTutorial}/>
        {$showTutorial}
    <p class="instructions">
      Vyberte obrázek a poté odpovídající text.
    </p>
    <div class="row">
      <!-- Images Column -->
      <div class="column">
        <h3>Obrázky</h3>
        {#each imageItems as img, i}
          <div class="card-wrapper">
            <button
              type="button"
              class="card {selectedImageIndex === i ? 'selected' : ''}"
              on:click={() => toggleImage(i)}
            >
              <img src={img.imgSrc} alt="Obrázek" />
            </button>
            <span class="download-link">
              <a href={img.imgSrc} target="_blank" rel="noopener noreferrer">📥</a>
            </span>
          </div>
        {/each}
      </div>

      <!-- Titles Column -->
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

      <!-- Completed Pairs Column -->
      <div class="completed-column">
        <h3>
          Vybraný pár 
          <button on:click={startGame}>🔁</button>
        </h3>
        {#each completedPairs as pair}
          <div class="completed-pair">
            <img src={pair.image.imgSrc} alt="Obrázek" class="pair-image" />
            <span class="arrow">➡️</span>
            <div class="pair-title">{pair.title.imgTitle}</div>
          </div>
        {/each}
      </div>

      <div class="good-job">
        {#if imageItems.length === 0 && titleItems.length === 0}
          <p>Všechny páry byly spárovány!</p>
          <button on:click={submitResults}>Zobrazit výsledky</button>
        {/if}
      </div>
    </div>
  
  {:else if state === 'done'}
    <h2>Zvládl jsi rozpoznat všechny nástrahy?</h2>
    <p>Tvé odpovědi:</p>
    <div class="row">
      {#each completedPairs as pair} 
        {#if pair.image.imgSrc !== pair.title.imgSrc}
          <div class="completed-pair wrong">
            <img src={pair.image.imgSrc} alt="Obrázek" class="pair-image" />
            <span class="arrow">➡️</span>
            <div class="pair-title">{pair.title.imgTitle}</div>
          </div>
        {:else}
          <div class="completed-pair correct">
            <img src={pair.image.imgSrc} alt="Obrázek" class="pair-image" />
            <span class="arrow">➡️</span>
            <div class="pair-title">{pair.title.imgTitle}</div>
          </div>
        {/if}
      {/each}
    </div>
    

    <h2>Správné odpovědi:</h2>
    <div class="row">
      {#each get(originalSources) as source}
        <div class="column">
          <div class="completed-pair">
            <img src={source.imgSrc} alt="Obrázek" class="pair-image" />
            <span class="arrow">➡️</span>
            <div class="pair-title">{source.imgTitle}</div>
          </div>
          <p class="description">Proč tomu tak je? ⬇️</p>
          <p class="img-description">{source.imgDescription}</p>
        </div>
      {/each}
    </div>
    <button  on:click={() => state = 'sorting'}>
      sorting
    </button>
  
  
  {:else if state== "sorting"}
  <h2>Zpětné vyhledávání obrázků přes vyhledávač máš za sebou. Nebylo to tak těžké, co? Škoda, že tohle neví každý, pak by si mohl informace snadno ověřit… Tak co, kdybychom je to naučili!</h2>
      <p>Sestav správné pořadí jednotlivých kroků pro vyhledání obrázku přes Google Lens:
      </p>
    <SortableList onComplete={handleSortFinish}/>  
    {#if sortFinished}
      <p>Skvěle! </p>
    <button on:click={() => completeLevel()}>Další pls</button>
    {/if}
  {/if}
</div>

<style>
 
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  h3 {
    font-size: 1.4rem;
    color: #555;
    margin-bottom: 0.5rem;
  }

  p, .description, .img-description {
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
  }

  .column, .completed-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }


  .completed-column {
    width: 260px;
  }

 

  .card-wrapper {
    position: relative;
  }

  /* Card styles for images and titles */
  button.card {
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
    transition: transform 0.2s, box-shadow 0.2s;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    position: relative;
    color: black;

  }
  
  button.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
  
  button.card.selected {
    animation: pulse 2s infinite;
  }
  
  .card img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
  }
  
  .download-link a {
    text-decoration: none;
    font-size: 1.4rem;
    position: absolute;
    bottom: 5px;
    right: 5px;
    color: #007bff;
  }
  
  .download-link a:hover {
    color: #0056b3;
  }
  
  /* Completed pair styling */
  .completed-pair {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #eef;
    width: 260px;
    transition: background 0.3s, transform 0.2s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    color: #333;
  }
  
  .completed-pair:hover {
    background: #ddeeff;
    transform: translateY(-2px);
  }
  
  .completed-pair.wrong {
    background: #ffcccc;
  }
  
  .completed-pair.correct {
    background: #ccffcc;
  }
  
  .pair-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
  }
  
  .arrow {
    font-size: 1.5rem;
  }
  
  .pair-title {
    font-size: 1rem;
    text-align: center;
    flex: 1;
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
</style>
