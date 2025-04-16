<script lang="ts">
    // --- BOARD COMPONENT LOGIC ---
    // This handles the board as well as the nested columns.
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';
    import { onMount } from 'svelte';
    import '../styles/04_dnd.css'

    interface ColumnItem {
        id: number | string;
        name: string;
        definition: string;
        correct_example: string;
        card_error: boolean;
        items: { id: string; name: string }[];
    }
  
    
    export let columnItems: ColumnItem[] = []; // Provided either as a prop or initiated here.
    export let onAllCorrect = (msg: string) => {};

    const flipDurationMs = 200;
  
    function checkDropZones() {
    let allCorrect = true;

    // Map over columns to mark incorrect ones.
    columnItems = columnItems.map(column => {
      // Only for cognitive bias columns (skip the examples column)
      if (column.id !== 'examples') {
        if (column.items.length !== 1 || column.items[0].name.trim() !== column.correct_example.trim()) {
          allCorrect = false;
          // Add an error flag
          return { ...column, card_error: true };
        } else {
          return { ...column, card_error: false };
        }
      }
      return { ...column, error: false };
    });

    if (allCorrect) {
      onAllCorrect("Všechny odpovědi jsou správné! Jsi připraven pokračovat dále?");
    }
  }
  
    // --- Card-level dndzone: reordering/moving items within a column
    function handleDndConsiderCards(cid: number|string, e) {
      console.log("cid:" + typeof cid);
      console.log(typeof e);
      // Find the column by its id
      const colIdx = columnItems.findIndex(c => c.id === cid);
      // Update that column’s items (while keeping the other columns unchanged)
      columnItems[colIdx].items = e.detail.items;
      // Spread into a new array so Svelte’s reactivity is triggered.
      columnItems = [...columnItems];
    }
    function handleDndFinalizeCards(cid: number|string, e) {
      const colIdx = columnItems.findIndex(c => c.id === cid);
      columnItems[colIdx].items = e.detail.items;
      columnItems = [...columnItems];
    }
    // --- Sample initialization code (e.g., using your API) ---
    // In your actual usage code you might fetch data and build columnItems.
    onMount(async () => {
    });
  </script>
  
  <!-- Board: outer container for the columns -->
  <section class="board">
    {#each columnItems as column (column.id)}
      <!-- Each column is rendered as a card -->
      <div 
        class="card"
        animate:flip={{ duration: flipDurationMs }}
        class:card-error={column.card_error}>
        <div class="card-header">
          {column.name}
          {#if column.definition}
            <p class="definition-tooltip"><strong>💡 zobrazit definici</strong></p>
            <select class="form-select" id="hidden">
              <option>{column.definition}</option>
            </select>
          {/if}
        </div>
        <div class="card-body">
          <!-- Drop zone for the column's items -->
          <div class="dropzone" 
               class:incorrect={column.card_error}
               use:dndzone={{ items: column.items, flipDurationMs, type: 'cards' }}
               on:consider={(e) => handleDndConsiderCards(column.id, e)}
               on:finalize={(e) => handleDndFinalizeCards(column.id, e)}>
            {#each column.items as item (item.id)}
              <div class="card-item" animate:flip={{ duration: flipDurationMs }}>
                {item.name}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
    <button class="check-btn" on:click={checkDropZones}>
      Zkontrolovat definice
    </button>
  </section>
 
  