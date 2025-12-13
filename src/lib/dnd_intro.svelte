<script lang="ts">
  import { writable, derived, get } from 'svelte/store';
  import type { StartQuiz } from '$types/interfaces';
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';

  // Guards + buffers
  let pendingPoolPush: StartQuiz[] = [];       // displaced chips destined for the pool

  export let onQuizComplete: () => void = () => {};
  export let quiz = writable<StartQuiz[]>([]);

  const sourceItems = writable<StartQuiz[]>([]);
  const assignments = writable<Record<number, StartQuiz | null>>({});
  const flipDurationMs = 200;

  let _done = false;
  let _interacted = false; // becomes true after first drop

  // Each definition card (drop target) has its own items array
  type Column = {
    id: number | string;
    description: string;
    items: StartQuiz[];
    card_error?: boolean;
  };
  let columnItems: Column[] = [];

  // init from quiz store
  quiz.subscribe((value) => {
    // pool (terms)
    const pool = [...value];
    shuffle(pool);
    sourceItems.set(pool);
    // targets (definitions)
    columnItems = value.map((q) => ({
      id: q.id,
      description: q.description,
      items: []
    }));
    // optional map, not used below but you had it
    const initAssignments: Record<number, StartQuiz | null> = {};
    value.forEach((q) => (initAssignments[q.id] = null));
    assignments.set(initAssignments);
  });

  
  function shuffle(array: StartQuiz[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

  function completeQuiz() {
    onQuizComplete();
  }

  // Completion is checked after interactions only
  function maybeComplete() {
  // no auto-complete here; rely on explicit checkDropZones()
  return;
  }

  // ---- DnD handlers ----
  // source pool handlers (must keep the store in sync)
  function handleSourceConsider(e: CustomEvent) {
    sourceItems.set(e.detail.items);
  }

  function handleSourceFinalize(e: CustomEvent) {
    // first reflect library's write
    sourceItems.set(e.detail.items);

    // then apply any displaced chips returning from swaps
    if (pendingPoolPush.length) {
      sourceItems.update((pool) => {
        const ids = new Set(pool.map((x) => x.id));
        const toAdd = pendingPoolPush.filter((x) => !ids.has(x.id));
        return [...pool, ...toAdd];
      });
      pendingPoolPush = [];
    }
  _interacted = true;
  maybeComplete();
  }

  function handleDndConsiderCards(cid: number | string, e: CustomEvent) {
  const colIdx = columnItems.findIndex((c) => c.id === cid);
  columnItems[colIdx].items = e.detail.items as StartQuiz[]; // allow many
  columnItems = [...columnItems];
}

function handleDndFinalizeCards(cid: number | string, e: CustomEvent) {
  const colIdx = columnItems.findIndex((c) => c.id === cid);
  columnItems[colIdx].items = e.detail.items as StartQuiz[]; // keep them all
  columnItems = [...columnItems];
  _interacted = true;
  maybeComplete();
}


  // check answers
  function checkDropZones() {
    // Mark per-column correctness (expect exactly one correct item per card)
    columnItems = columnItems.map((column) => {
      const isCorrect = column.items.length === 1 && column.items[0]?.id === column.id;
      return { ...column, card_error: !isCorrect };
    });

    // Complete only when every column is correct and the pool is empty
    const allCorrect = columnItems.every((c) => c.card_error === false);
    const poolEmpty = get(sourceItems).length === 0;
    if (allCorrect && poolEmpty && !_done) {
      _done = true;
      completeQuiz();
    }
  }
</script>

<section class="board">
  <!-- term pool -->
  <div class="pool">
    <div
      class="dropzone pool-zone"
      data-zoneid="pool"
      use:dndzone={{ items: $sourceItems, flipDurationMs, type: 'match' }}
      on:consider={handleSourceConsider}
      on:finalize={handleSourceFinalize}
    >
      {#each $sourceItems as item (item.id)}
        <div class="chip" data-id={item.id} animate:flip={{ duration: flipDurationMs }}>
          {item.term}
        </div>
      {/each}
    </div>
  </div>

  <div class="definition-cards">
  <!-- definition cards (targets) -->
  {#each columnItems as col (col.id)}
    <div class="card {col.card_error ? 'card-error' : ''}" animate:flip={{ duration: flipDurationMs }}>
      <div class="card-header">
        {col.description}
      </div>
      <div class="card-body">
        <div
          class="dropzone"
          data-zoneid={String(col.id)}
          use:dndzone={{ items: col.items, flipDurationMs, type: 'match' }}
          on:consider={(e) => handleDndConsiderCards(col.id, e)}
          on:finalize={(e) => handleDndFinalizeCards(col.id, e)}
        >
          {#if col.items.length === 0}
            <span class="placeholder">Přetáhni správný pojem sem</span>
          {/if}
          {#each col.items as item (item.id)}
            <div class="dropzone-item" data-id={item.id}>
              {item.term}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/each}
  </div>

  <button on:click={checkDropZones}>Zkontrolovat</button>
</section>

<style>
  .board {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    margin: 1rem 0;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .definition-cards {
    max-height: clamp(260px, 45vh, 560px); /* scroll only when tall */
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch; /* smoother on iOS */
    overscroll-behavior: contain; /* prevent parent scroll chaining */
    padding-right: 4px; /* avoid scrollbar overlaying content */
  }

  @media (max-width: 768px) {
    .definition-cards {
      max-height: 40vh; /* a bit shorter on small screens */
    }
  }

  .pool {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 0.75rem;
  }
  .chip {
    border: 1px solid #ccc;
    border-radius: 999px;
    padding: 0.35rem 0.7rem;
    background: #fafafa;
    font-size: 0.95rem;
    user-select: none;
    cursor: grab;
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  }
  .pool-zone { min-height: 56px; }

  .card {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0 0.25rem;
  }
  .card-error .dropzone { border-color: #f04438; background: #fff5f4; }
  .card:active { transform: scale(0.98); box-shadow: 0 4px 8px rgba(0,0,0,0.12); }

  .card-header { font-size: 1rem; font-weight: 600; color: #333; margin-bottom: 0.25rem; }
  .card-body { font-size: 1rem; line-height: 1.5; color: #555; }

  .dropzone {
    background: #fafafa;
    border: 2px dashed #ccc;
    border-radius: 6px;
    padding: 0.5rem;
    min-height: 60px;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    transition: background-color .3s ease, border-color .3s ease;
  }
  .dropzone:hover, .dropzone:focus { background-color: #f0f0f0; border-color: #bbb; }

  .dropzone-item {
    padding: 0.35rem 0.7rem;
    border: 1px solid #ccc;
    border-radius: 999px;
    background: #fff;
  }

  .placeholder { opacity: 0.6; font-size: 0.9rem; }

  .check-btn {
    align-self: flex-start;
    background: #1f6feb;
    color: #fff;
    border: 0;
    padding: 0.55rem 0.9rem;
    border-radius: 8px;
    cursor: pointer;
  }
</style>
