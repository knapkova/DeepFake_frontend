<script lang="ts">
  import { onMount } from 'svelte';
	import { draggable, droppable, dndState, type DragDropState } from '@thisux/sveltednd';
	import { writable, derived } from 'svelte/store';
	import type { StartQuiz } from '$types/interfaces';
	export let onQuizComplete: () => void = () => {};


	function completeQuiz() {
		onQuizComplete();
	}

	let _done = false;
	$: if ($isSourceEmpty && !_done) {
		_done = true;
		completeQuiz();
	}

	export let quiz = writable<StartQuiz[]>([]);

	// Declare sourceItems and assignments before using them in a subscription
	const sourceItems = writable<StartQuiz[]>([]);
	const assignments = writable<Record<number, StartQuiz | null>>({});

	let quizTerms: StartQuiz[] = [];
	quiz.subscribe((value) => {
		quizTerms = value;
		// Reinitialize sourceItems and assignments when quiz is loaded
		sourceItems.set([...value]);
		const initAssignments: Record<number, StartQuiz | null> = {};
		value.forEach((q) => (initAssignments[q.id] = null));
		assignments.set(initAssignments);
	});

	// Helper to know if the source is empty
	const isSourceEmpty = derived(sourceItems, ($sourceItems) => $sourceItems.length === 0);

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
		sourceItems.update((items) => items.filter((i) => i.id !== state.draggedItem!.id));

		// Assign into that term’s slot
		assignments.update((a) => {
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
		<!-- LEFT COLUMN: Definitions source -->
		<div class="source-column" use:droppable={{ container: 'source' }}>
  {#each $sourceItems as item (item.id)}
    <div
      class="card "
      use:draggable={{
        container: 'source',
        dragData: item,
        callbacks: { onDragEnd: handleDragEnd }
      }}
    >
      {item.description}
    </div>
  {/each}
</div>


		<!-- RIGHT COLUMNS: One per term -->
		<div class="targets">
			{#each quizTerms as q (q.id)}
				<div
					class="column {dndState.isDragging && dndState.targetContainer === `target-${q.id}`
						? dndState.invalidDrop
							? 'invalid-drop'
							: 'drag-over'
						: ''}"
					use:droppable={{
						container: `target-${q.id}`,
						callbacks: {
							onDragOver: (st) => onDragOverTerm(st, q.description),
							onDrop: (st) => onDropTerm(st, q.id, q.description),
							onDragEnd: () => handleDragEnd()
						}
					}}
				>
					<h4>{q.term}</h4>
					{#if $assignments[q.id]}
						<div class="card">{$assignments[q.id]!.description}</div>
					{:else}
						<div class="placeholder">Sem přetáhni definici</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{:else}
	<p>Kvíz se načítá...</p>
{/if}

<style>
	.board {
		display: flex;
		gap: 1rem;
		margin: 1rem;
		align-items: flex-start;
		flex-direction: row;
	}
	.source-column {
		flex: 0 0 350px;
		padding: 1rem;
		border: 2px dashed #ccc;
		border-radius: 8px;
		background: #fafafa;
	}
	.targets {
		flex: 1;
		display: flex;
		gap: 1rem;
		flex-direction: column;
	}
	.column {
		flex: 1 1 150px;
		min-width: 150px;
		padding: 1rem;
		border: 2px dashed #ccc;
		border-radius: 8px;
		background: #fff;
		position: relative;
	}
	.column.drag-over {
		background: #e6f7ff;
	}
	.column.invalid-drop {
		background: #e6f7ff;
	}
	.card {
		padding: 0.5rem;
    touch-action: none;
    user-select: none;

		margin: 0.5rem 0;
		background: #fff;
		border: 1px solid #aaa;
		border-radius: 4px;
		cursor: grab;
		color: black;
		font-style: italic;
	}
	.placeholder {
		color: #888;
		font-style: italic;
	}

	@media screen and (max-width: 768px) {
		.board {
			display: flex;
			gap: 1rem;
			margin: 1rem;
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
