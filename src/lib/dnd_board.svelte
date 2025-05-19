<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { onMount } from 'svelte';
	import '../styles/04_dnd.css';

	interface ColumnItem {
		id: number | string;
		name: string;
		definition: string;
		correct_example: string;
		card_error: boolean;
		items: { id: string; name: string }[];
	}

	export let columnItems: ColumnItem[] = [];
	export let onAllCorrect = (msg: string) => {};

	const flipDurationMs = 200;

	function checkDropZones() {
		let allCorrect = true;

		// Map over columns to mark incorrect ones.
		columnItems = columnItems.map((column) => {
			// Only for cognitive bias columns (skip the examples column)
			if (column.id !== 'examples') {
				if (
					column.items.length !== 1 ||
					column.items[0].name.trim() !== column.correct_example.trim()
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

		if (allCorrect) {
			onAllCorrect('Všechny odpovědi jsou správné! Jsi připraven pokračovat dále?');
		}
	}

	// --- Card-level dndzone: reordering/moving items within a column
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

	onMount(async () => {});
</script>

<!-- Board: outer container for the columns -->
<section class="board">
	{#each columnItems as column (column.id)}
		<!-- Each column is rendered as a card -->
		<div
			class="card"
			animate:flip={{ duration: flipDurationMs }}
			class:card-error={column.card_error}
		>
			<div class="card-header">
				{column.name}
				{#if column.definition}
					<p class="definition-tooltip"><strong>💡 zobrazit definici</strong></p>
					<p class="form-select" id="hidden">
						{column.definition}
					</p>
				{/if}
			</div>
			<div class="card-body">
				<div
					class="dropzone"
					class:incorrect={column.card_error}
					use:dndzone={{ items: column.items, flipDurationMs, type: 'cards' }}
					on:consider={(e) => handleDndConsiderCards(column.id, e)}
					on:finalize={(e) => handleDndFinalizeCards(column.id, e)}
				>
					{#each column.items as item (item.id)}
						<div class="card-item" animate:flip={{ duration: flipDurationMs }}>
							{item.name}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}
	<button class="check-btn" on:click={checkDropZones}> Zkontrolovat </button>
</section>

<style>
	.form-select {
		font-size: small;
		padding-left: 25px;
		font-style: italic;
		color: gray;
	}

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
		font-size: 1.3rem;
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

	/* Draggable items inside drop zones */
	.card-item {
		padding: 0.5rem 0.75rem;
		background: #f8e6a980; /* white background */
		color: #333; /* darker text */
		border: 1px solid #ddd; /* subtle border */
		border-radius: 4px;
		cursor: grab;
		white-space: normal;
		word-break: break-word;
		flex: 1 1 auto; /* let cards grow/shrink */
		min-width: 120px;
		overflow: hidden;
		font-size: 0.95rem;
		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.card-item:hover {
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
	}

	.card-item:active {
		transform: scale(0.98);
		box-shadow: none;
		cursor: grabbing;
	}

	#hidden {
		filter: blur(3px);
		transition:
			filter 0.5s ease,
			transform 0.5s ease;
	}

	.definition-tooltip {
		color: #bbb;
		font-size: 0.8rem;
		font-style: italic;
	}

	.definition-tooltip:hover + #hidden {
		filter: blur(0);
	}

	.card-error {
		border: 2px solid #dc3545;
		box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
	}
</style>
