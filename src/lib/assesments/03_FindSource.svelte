<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { writable, get } from 'svelte/store';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import LensExplanationPopup from '$components/LensExplanation_popup.svelte';
	import LensPrequel from '$components/LensPrequel.svelte';
	import SortableList from '$components/sortable_list_lens.svelte';

	export let onLevelComplete: () => void = () => {};
	let showTutorial = writable(false);

	let sortFinished = false;
	function handleSortFinish(correct: boolean) {
		if (correct) {
			sortFinished = true;
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
	const api_get_by_category =
		'/api/Admin/AssignmentFindPictureSource/GetAssignmentFindPictureSourcesByCategoryId/';

	let originalSources = writable<AssignmentFindPictureSource[]>([]);
	let imageItems: AssignmentFindPictureSource[] = [];
	let titleItems: AssignmentFindPictureSource[] = [];
	let completedPairs: { image: AssignmentFindPictureSource; title: AssignmentFindPictureSource }[] =
		[];

	// Using indices to track the selection per column
	let selectedImageIndex: number | null = null;
	let selectedTitleIndex: number | null = null;

	type GameState = 'start' | 'explain' | 'play' | 'done' | 'sorting';
	let state: GameState = 'start';

	let lensIntroComplete = false;

	async function handleLensIntroComplete() {
		await tick();
		await new Promise((resolve) => setTimeout(resolve, 2000));

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
	{#if state === 'start'}
		{#if lensIntroComplete}
			<div class="start-layout">
				<h2 class="start-heading">🚀 Připrav se na hru!</h2>
				<div class="left-card">
					<p class="intro-text">
						Ivan přidává další materiály – několik fotografií, které podle něj dokazují, že přistání
						na Marsu už proběhlo. … Dokážeš o nich zjistit víc?
					</p>
					<button on:click={startGame}>Začít hru</button>
				</div>
				<div class="right-images">
					<img src="/mars_fake2.webp" alt="Mars falešný 2" />
				</div>
			</div>
		{:else}
			<LensPrequel onComplete={handleLensIntroComplete} />
		{/if}
	{:else if state === 'play'}
		<LensExplanationPopup showLensExplanation={true} />
		<div class="game-header">
			<button on:click={() => showTutorial.set(true)}> 📸 Google Lens návod</button>
			<LensExplanationPopup bind:showLensExplanation={$showTutorial} />
			<p class="instructions">Kliknutím na obrázek a zdroj vytvořte pár.</p>
		</div>
		{#if imageItems.length === 0 && titleItems.length === 0}
			<div class="good-job">
				<p>Všechny páry byly spárovány! Jak se ti dařilo?</p>
				<button on:click={submitResults}>Zobrazit výsledky</button>
			</div>
		{/if}

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
				<h3>Zdroj</h3>
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
				<h3>Vybraný pár</h3>
				<button on:click={startGame}>🔁</button>

				{#each completedPairs as pair}
					<div class="completed-pair">
						<img src={pair.image.imgSrc} alt="Obrázek" class="pair-image" />
						<span class="arrow">➡️</span>
						<div class="pair-title">{pair.title.imgTitle}</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if state === 'done'}
		<h3>Zvládl jsi rozpoznat všechny nástrahy?</h3>
		<p>Tvé odpovědi:</p>
		<div class="row">
			{#each completedPairs as pair}
				<div class="completed-pair {pair.image.imgSrc !== pair.title.imgSrc ? 'wrong' : 'correct'}">
					<img src={pair.image.imgSrc} alt="Obrázek" class="pair-image" />
					<span class="arrow">➡️</span>
					<div class="pair-title">{pair.title.imgTitle}</div>
				</div>
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
		<button on:click={() => (state = 'sorting')}> Jdeme dál </button>
	{:else if state == 'sorting'}
		<SortableList onComplete={handleSortFinish} />
		{#if sortFinished}
			<p>Skvěle!</p>
			<button on:click={() => completeLevel()}>Pokračovat</button>
		{/if}
	{/if}
</div>

<style>
	.start-layout {
		background: linear-gradient(135deg, #f0f9ff, #cbebff);
		border-radius: 16px;
		padding: 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		animation: fadeIn 0.5s ease-out both;
	}

	.start-heading {
		width: 100%;
		text-align: center;
		font-size: 2rem;
		margin-bottom: 1rem;
		animation: fadeInUp 0.5s ease-out both;
	}

	.column h3,
	.completed-column h3 {
		position: relative;
		font-size: 1.4rem;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		background: linear-gradient(90deg, #ff2121, #fe7b7b);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-bottom: 1rem;
		padding-bottom: 0.25rem;
	}

	.column h3::after,
	.completed-column h3::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 40px;
		height: 3px;
		background: #ec2020;
		border-radius: 2px;
	}

	/* optional: add a little icon before */
	.column h3::before,
	.completed-column h3::before {
		content: '📌';
		margin-right: 0.5rem;
	}
	.game-header {
		display: flex;
		background: white;
		border-radius: 5%;
		padding: 1rem;
		flex-direction: column;
	}
	.good-job {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		max-width: 500px;
		margin: 1.5rem auto;
		padding: 1rem 1.5rem;

		background: #e6ffed; /* very light green */
		border: 1px solid #34cb4d; /* bright accent */
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

		text-align: center;
		gap: 0.5rem;
	}
	.start-layout {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin: 20px 0;
		align-items: flex-start;
	}

	.left-card {
		flex: 1 1 300px;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		text-align: center;
	}

	.intro-text {
		margin: 0 0 16px;
		line-height: 1.6;
		color: #333;
	}

	.right-images {
		flex: 1 1 300px;
		display: flex;
		justify-content: center;
	}
	.right-images img {
		max-width: 100%;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.container {
		max-width: 1200px;
		margin: 1rem auto;
		text-align: center;
	}

	h2 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	p,
	.description,
	.img-description {
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
		background: white;
		padding: 1rem 0;
	}

	.column,
	.completed-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		min-width: 260px;
	}

	.completed-column {
		width: 260px;
	}

	.card-wrapper {
		position: relative;
	}

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
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		border-radius: 12px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		position: relative;
		color: black;
	}

	button.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
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
	}

	.download-link a:hover {
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
		transition:
			background 0.3s,
			transform 0.2s;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		color: #333;
	}

	.completed-pair:hover {
		background: #eef;
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
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
