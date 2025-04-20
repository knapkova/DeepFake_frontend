<script lang="ts">
    import { draggable, droppable, dndState, type DragDropState } from '@thisux/sveltednd';
    import { writable, derived } from 'svelte/store';
    import type { StartQuiz } from '$types/interfaces';
    
    export let quiz = writable<StartQuiz[]>([]);

    // Declare sourceItems and assignments before using them in a subscription
    const sourceItems = writable<StartQuiz[]>([]);
    const assignments = writable<Record<number, StartQuiz|null>>({});

    let quizTerms: StartQuiz[] = [];
    quiz.subscribe(value => {
      quizTerms = value;
      // Reinitialize sourceItems and assignments when quiz is loaded
      sourceItems.set([...value]);
      const initAssignments: Record<number, StartQuiz|null> = {};
      value.forEach(q => initAssignments[q.id] = null);
      assignments.set(initAssignments);
    });
  
    // Helper to know if the source is empty
    const isSourceEmpty = derived(sourceItems, $sourceItems => $sourceItems.length === 0);
  
    // All container IDs remain the same but for sourceItems now
    const allContainers = derived(
      sourceItems,
      $items => [
        "source",
        ...quizTerms.map(q => `target-${q.id}`)
      ]
    );

    function onDragOverTerm(st: DragDropState<StartQuiz>, desc: string) {
    return validateDrop(st, desc);
    }
    function onDropTerm(st: DragDropState<StartQuiz>, id: number, desc: string) {
      return handleDropZone(st, id, desc);
    }
  
    // Validation: only accept the exact matching description
    function validateDrop(state: DragDropState<StartQuiz>, correctDesc: string) {
      if (!state.draggedItem) return;
      if (state.draggedItem.description !== correctDesc) {
        dndState.invalidDrop = true;
        return false; // veto the drop
      }
      dndState.invalidDrop = false;
    }
  
    // Drop handler: remove item from sourceItems, assign into term slot
    function handleDropZone(state: DragDropState<StartQuiz>, termId: number, correctDesc: string) {
      if (!state.isDragging) return;
      if (dndState.invalidDrop || !state.draggedItem) return;
  
      // Remove from sourceItems
      sourceItems.update(items => items.filter(i => i.id !== state.draggedItem!.id));
  
      // Assign into that term’s slot
      assignments.update(a => {
        a[termId] = state.draggedItem!;
        return { ...a };
      });
      dndState.draggedItem = null;
    }
  
    // Reset invalidDrop on drag end
    function handleDragEnd() {
      dndState.invalidDrop = false;
      dndState.draggedItem = null;

    }
</script>
{#if quizTerms.length > 0}

<div class="board">
    <!-- SOURCE ZONE -->
    <div
      class="column"
      use:droppable={{ container: 'source' }}
    >
      <h3>Available Descriptions</h3>
      {#if $isSourceEmpty}
        <div class="placeholder">None left</div>
      {:else}
        {#each $sourceItems as item (item.id)}
          <div 
            class="card"
            use:draggable={{ 
              container: 'source', 
              dragData: item,
              callbacks: { onDragEnd: handleDragEnd }
            }}>
            {item.description}
          </div>
        {/each}
      {/if}
    </div>
  
    <!-- ONE COLUMN PER TERM -->
    {#each quizTerms as q (q.id)}
      <div
        class="column 
          {dndState.isDragging && dndState.targetContainer===`target-${q.id}` 
            ? dndState.invalidDrop ? 'invalid-drop':'drag-over' 
            : ''}"
        use:droppable={{
          container: `target-${q.id}`,
          callbacks: {
            onDragOver: st => onDragOverTerm(st, q.description),
            onDrop:     st => onDropTerm(st, q.id, q.description),
            onDragEnd:  () => handleDragEnd()
          }
        }}
      >
        <h3>{q.term}</h3>
        {#if $assignments[q.id]}
          <div class="card">{$assignments[q.id]!.description}</div>
        {:else}
          <div class="placeholder">Zde přetáhni správnou definici!</div>
        {/if}
      </div>
    {/each}
  

</div>
{:else}
    <p>No quiz items available.</p>
{/if}
  
  <style>
    .board { display: flex; gap: 1rem; }
    .column {
      flex: 1;
      padding: 1rem;
      border: 2px dashed #ccc;
      min-height: 150px;
      position: relative;
    }
    .column.drag-over { background: #eef; }
    .column.invalid-drop { background: #fee; }
    .card {
      padding: 0.5rem;
      margin: 0.25rem 0;
      background: #fff;
      border: 1px solid #999;
      cursor: grab;
    }
    .placeholder {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      color: #999;
    }
  </style>