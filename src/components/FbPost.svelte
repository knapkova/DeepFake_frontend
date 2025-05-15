<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import { writable } from 'svelte/store';
	import type { AssignmentIntroductionArticle } from '$types/interfaces';


	const article_id = 6;
	let article = writable<AssignmentIntroductionArticle[]>([]);
	const get_req =
		'/api/Admin/AssignmentIntroductionArticle/GetAssignmentIntroductionArticlesById/' + article_id;

	onMount(() => {
		fetchArticle().then((data) => {
			article.set(data);
		});
	});

	async function fetchArticle() {
		const response = await fetch(PUBLIC_VITE_API_ROOT + get_req, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const data = await response.json();
		console.log('data', data);
		const fetchedArticle: AssignmentIntroductionArticle[] = Array.isArray(data) ? data : [data];
		return fetchedArticle;
	}
</script>

<div class="fb-post">
    {#if $article.length > 0}
        <div class="fb-header">
            <img class="fb-avatar" src="/path/to/avatar.jpg" alt="User avatar" />
            <div class="fb-user-info">
                <span class="fb-name">{$article[0].title}</span>
                <span class="fb-time">před minutou</span>
            </div>
            <div class="fb-options">⋯</div>
        </div>
        <div class="fb-content">
            {@html $article[0].content}
        </div>
        {#if $article[0].imgSrc}
            <img src={$article[0].imgSrc} alt="" class="fb-media" />
        {/if}
        <p class="fb-instructions">
            {$article[0].Instructions}
        </p>
        <div class="fb-actions">
            <div class="fb-action-buttons">
                <button class="fb-action-btn">👍 Reagovat</button>
                <button class="fb-action-btn">💬 Komentáře (143)</button>
                <button class="fb-action-btn">🔄 Sdílet</button>
            </div>
        </div>
    {:else}
        <p>Načítám článek…</p>
    {/if}

    </div>
    <style>
        .fb-actions {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		border-top: 1px solid #ddd;
		padding: 8px 12px;
		background: #fafafa;
		flex-direction: column;
	}
	
	.fb-action-buttons {
		display: flex;
		flex: 1;
		justify-content: space-evenly;
	}
	.fb-action-btn {
		background: none;
		border: none;
		margin: 0 0.5rem;
		background: rgba(0, 0, 0, 0.026);
		color: #65676b;
		font-size: 14px;
		display: flex;
		align-items: center;
		padding: 6px 8px;
		border-radius: 4px;
		cursor: pointer;
		box-shadow: none !important;
	}
	.fb-action-btn:hover {
		background: rgba(0, 0, 0, 0.05) !important;
		box-shadow: none !important;
	}
	.fb-post {
		max-width: 500px;
		margin: 1rem auto;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		font-family: Helvetica, Arial, sans-serif;
		color: #1c1e21;
		overflow: hidden;
	}

	.fb-header {
		display: flex;
		align-items: center;
		padding: 12px;
	}
	.fb-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 8px;
	}
	.fb-user-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}
	.fb-name {
		font-weight: bold;
		font-size: 14px;
	}
	.fb-time {
		font-size: 12px;
		color: #65676b;
	}
	.fb-options {
		font-size: 20px;
		color: #65676b;
		cursor: pointer;
	}

	.fb-content {
		margin: 8px 12px;
		font-size: 14px;
		line-height: 1.4;
	}
	.fb-media {
		width: 100%;
		display: block;
		margin-top: 8px;
	}
	.fb-instructions {
		margin: 8px 12px 0;
		font-size: 13px;
		color: #65676b;
	}

	.fb-button {
		position: relative;
		overflow: hidden;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: calc(100% - 24px);
		margin: 12px;
		padding: 8px 0;
		background: #1877f2;
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.fb-button:disabled {
		opacity: 0.7;
		cursor: default;
	}
    </style>