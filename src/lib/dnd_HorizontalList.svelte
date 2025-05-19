<script lang="ts">
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';
    import type { AssignmentCognitiveBias } from '$types/interfaces';
    import type { Writable } from 'svelte/store';
    import { get } from 'svelte/store';
  
    // The `items` store is provided from the parent.
    // For example, each drop zone might manage a single-item array (for unique drop).
    export let items: Writable<AssignmentCognitiveBias[]>; 
    // Dimensions for this drop zone:
    export let containerWidth = '30vw';
    export let itemWidth = '25vw';
    // When true, only one item is allowed in the dropzone.
    export let singleSelection = true;
    // Callback fired after an item is dropped; useful for parent components.
    export let onItemDropped = (event) => {};
  
    const flipDurationMs = 300;
  
    function handleDndConsider(e: any) {
      // Update the store using the new items array from the event.
      items.set(e.detail.items);
    }
  
    function handleDndFinalize(e: any) {
      // We create a new reference to trigger reactivity.
      items.set([...e.detail.items]);
  
      // Call a callback (if provided) with the updated items.
      if (onItemDropped) {
        onItemDropped({ items: get(items) });
      }
    }
  </script>
  
  <style>
    section {
      height: 160px;
      padding: 0.3em;
      background-color: lightgray;
      border-left: red 1px solid;
      display: flex;
      overflow-x: scroll;
      /* You might customize the width dynamically. */
    }
    div {
      height: fit-content;
      display: inline-block;
      padding: 0.9em;
      border: 1px solid rgb(167, 167, 169);
      margin: 0 0.15em;
    }
  </style>
  
  {#if singleSelection}
    <section 
      style="width:20vw" 
      use:dndzone={{ 
        items: $items, 
        flipDurationMs,
        // Set a common type across drop zones so definitions can be moved between zones.
        type: 'definition' 
      }} 
      on:consider={handleDndConsider} 
      on:finalize={handleDndFinalize}
    >
      {#each $items as item (item.id)}
        <div style="flex: 0 0 {itemWidth}" animate:flip={{ duration: flipDurationMs }}>
          {item.cognitiveBias}
        </div>
      {/each}
    </section>
  {:else}
    <section 
      style="width:{containerWidth}" 
      use:dndzone={{ 
        items: $items, 
        flipDurationMs,
        type: 'definition'
      }} 
      on:consider={handleDndConsider} 
      on:finalize={handleDndFinalize}
    >
      {#each $items as item (item.id)}
        <div style="flex: 0 0 {itemWidth}" animate:flip={{ duration: flipDurationMs }}>
          {item.cognitiveBias}
        </div>
      {/each}
    </section>
  {/if}
  