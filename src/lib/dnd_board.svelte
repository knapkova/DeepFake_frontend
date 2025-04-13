<script lang="ts">
    // --- BOARD COMPONENT LOGIC ---
    // This handles the board as well as the nested columns.
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import type { AssignmentCognitiveBias } from '$types/interfaces';
    import '../styles/04_dnd.css'

    interface ColumnItem {
        id: number | string;
        name: string;
        definition: string;
        correct_example: string;
        items: { id: string; name: string }[];
    }
  
    
    export let columnItems: ColumnItem[] = []; // Provided either as a prop or initiated here.
    export let state: 'start' | 'end' = 'start';
    const flipDurationMs = 200;
  
    // --- Column-level dndzone: reordering the columns
    function handleDndConsiderColumns(e) {
      // Update the entire list of columns when the drag is in progress
      columnItems = e.detail.items;
    }
    function handleDndFinalizeColumns(e) {
      // Finalize the reordering of columns
      columnItems = e.detail.items;
    }
  
    // --- Card-level dndzone: reordering/moving items within a column
    function handleDndConsiderCards(cid, e) {
      // Find the column by its id
      const colIdx = columnItems.findIndex(c => c.id === cid);
      // Update that column’s items (while keeping the other columns unchanged)
      columnItems[colIdx].items = e.detail.items;
      // Spread into a new array so Svelte’s reactivity is triggered.
      columnItems = [...columnItems];
    }
    function handleDndFinalizeCards(cid, e) {
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
      <div class="card" animate:flip={{ duration: flipDurationMs }}>
        <div class="card-header">
          {column.name}
          {#if column.definition}
            <p><strong>Definice</strong></p>
            <select class="form-select">
              <option>{column.definition}</option>
            </select>
          {/if}
        </div>
        <div class="card-body">
          
          <!-- Drop zone for the column's items -->
          <div class="dropzone"
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
  </section>
  