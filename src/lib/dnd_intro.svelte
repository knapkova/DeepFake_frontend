<script lang="ts">
    import { writable, derived } from 'svelte/store';
    import type { StartQuiz } from '$types/interfaces';
    import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
    export let onQuizComplete: () => void = () => {};
    export let quiz = writable<StartQuiz[]>([]);

    const sourceItems = writable<StartQuiz[]>([]);
    const assignments = writable<Record<number, StartQuiz | null>>({});
    	const flipDurationMs = 200;

    const isSourceEmpty = derived(sourceItems, ($sourceItems) => $sourceItems.length === 0);
    let _done = false;
    let quizTerms: StartQuiz[] = [];
    // Define columnItems as an array to avoid reference errors
    let columnItems: { id: number | string, items: StartQuiz[] }[] = [];
    

  quiz.subscribe((value) => {
    quizTerms = value;
    // Reinitialize sourceItems and assignments when quiz is loaded
    sourceItems.set([...value]);
    const initAssignments: Record<number, StartQuiz | null> = {};
    value.forEach((q) => (initAssignments[q.id] = null));
    assignments.set(initAssignments);

        // Initialize columnItems with quiz terms if needed
        columnItems = value.map(q => ({ id: q.id, items: [] }));
  });

    function completeQuiz() {
		onQuizComplete();
	}

	$: if ($isSourceEmpty && !_done) {
		_done = true;
		completeQuiz();
	}

function handleDndConsiderCards(cid: number | string, e) {
		console.log('cid:' + typeof cid);
		console.log(typeof e);
		// Find the column by its id
		const colIdx = columnItems.findIndex((c) => c.id === cid);
		// Update that column’s items (while keeping the other columns unchanged)
		columnItems[colIdx].items = e.detail.items;
		// Spread into a new array so Svelte’s reactivity is triggered.
		columnItems = [...columnItems];
	}
	function handleDndFinalizeCards(cid: number | string, e) {
		const colIdx = columnItems.findIndex((c) => c.id === cid);
		columnItems[colIdx].items = e.detail.items;
		columnItems = [...columnItems];
	}
    




function checkDropZones() {
   let allCorrect = true;
		// Map over columns to mark incorrect ones.
		columnItems = columnItems.map((column) => {
			// Only for cognitive bias columns (skip the examples column)
			if (column.id !== 'examples') {
				if (
					column.items.length !== 1 ||
					column.items[0].id !== column.id
				) {
					allCorrect = false;
					// Add an error flag
					return { ...column, card_error: true };
				} else {
					return { ...column, card_error: false };
				}
			}
			return { ...column, error: false };
		});
	}


</script>

<section class="board">
    {#each $sourceItems as item (item.id)}
    <div
      class="card"
      animate:flip={{ duration: flipDurationMs }}
    >
      <div class="card-header">
        {item.description}
      </div>
      <div class="card-body">
        <div class="dropzone"
        use:dndzone={{items: $sourceItems, flipDurationMs, type: 'source'}}
        on:consider={(e) => handleDndConsiderCards(item.id, e)}
    on:finalize={(e) => handleDndFinalizeCards(item.id, e)}>
            {#each $sourceItems as item (item.id)}
              <div class="dropzone-item" data-id={item.id}>
                {item.term}
              </div>
            {/each}
        </div>
      </div>
    </div>
  {/each}
	<button class="check-btn" on:click={checkDropZones}> Zkontrolovat </button>

</section>

<style>
	/* Modern Card style */
	.card {
		background: #ffffff;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1rem;
	}
	.card:active {
		transform: scale(0.98);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
	}

	/* Card header & body styling */
	.card-header {
		font-size: 1rem;
		font-weight: bold;
		color: #333;
		margin-bottom: 0.5rem;
	}
	.card-body {
		font-size: 1rem;
		line-height: 1.5;
		color: #555;
	}

	
	/* Board container - vertical stacking of column cards */
	.board {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		margin: 1rem 0;
		background: #f8f9fa;
		border-radius: 8px;
	}

	/* Drop zone styling (for drag/drop areas within a card) */
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
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}
	.dropzone:hover,
	.dropzone:focus {
		background-color: #f0f0f0;
		border-color: #bbb;
	}

	
</style>
