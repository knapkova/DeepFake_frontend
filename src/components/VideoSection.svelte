<script lang="ts">
	import { onMount } from 'svelte';
	import type { Category } from '$types/interfaces';
	import { getActiveCategories } from '$lib/db/categories';
	import { writable } from 'svelte/store';

	let categories = writable<Category[]>([]);

	onMount(async () => {
		categories.set(await getActiveCategories());
	});

	// Categories that have a playable game. Others are shown as "coming soon".
	const GAME_ROUTES: Record<number, string> = {
		11: '/marsGate'
	};
</script>

<div class="scrollable-container">
	{#each $categories as video (video.id)}
		{@const route = GAME_ROUTES[video.id]}
		<div class="selection">
			{#if route}
				<a href={route} class="play-btn" aria-label="Hrát {video.name}" data-sveltekit-reload>▷</a>
			{:else}
				<span class="play-btn soon">Již brzy</span>
			{/if}
			<div class="video-card" style="background-image: url({video.imgSrc});">
				<div class="video-info">
					<div class="video-text">
						<h2>{video.name}</h2>
						<p>{video.description}</p>
					</div>
					{#if route}
						<h3>{video.duration} min</h3>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	/* Container fixed on the right side */
	.scrollable-container {
		position: fixed;
		top: 0;
		right: 0;
		width: 30%;
		height: 100vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-right: 1rem;
		padding-top: 1rem;
	}

	/* One “card” row: play button + thumbnail card */
	.selection {
		display: flex;
		align-items: flex-end;
	}

	.play-btn {
		align-self: flex-end;
		background-color: #ff0000;
		color: #fff;
		border: none;
		font-size: 24px;
		width: 72px;
		height: 72px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		flex-shrink: 0;
	}

	.play-btn.soon {
		background-color: #6b7280;
		font-size: 0.7rem;
		text-align: center;
		cursor: default;
	}

	/* The thumbnail container */
	.video-card {
		flex: 1;
		height: 440px; /* Adjust as needed */
		position: relative;
		background-size: cover;
		background-position: center;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	/* Dark overlay with text at the bottom */
	.video-info {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		padding: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.video-info h2 {
		margin: 0 0 0.25rem;
		font-size: 2rem;
	}

	.video-info p {
		margin: 0;
		font-size: 0.8rem;
		font-family: 'Courier New', Courier, monospace;
	}

	.video-info h3 {
		margin: 0;
		font-size: 0.9rem;
		white-space: nowrap;
	}

	@media screen and (max-width: 768px) {
		.scrollable-container {
			position: relative;
			width: 100%;
			height: auto;
			flex-direction: column;
			overflow-x: auto;
			overflow-y: hidden;
			padding: 0.5rem 0;
			gap: 0.5rem;
		}
		.selection {
			align-items: center;
		}
		.video-card {
			height: 150px;
			min-width: 120px;
		}
		.play-btn {
			width: 40px;
			height: 40px;
			font-size: 18px;
		}
		.video-info h2 {
			font-size: 1rem;
		}
		.video-info p {
			font-size: 0.7rem;
		}
	}
</style>
