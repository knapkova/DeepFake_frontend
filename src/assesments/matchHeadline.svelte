<script lang="ts">
    import { onMount } from 'svelte';
    import { draggable, dropzone } from '$lib/dnd';

    interface Article {
        id: number;
        headline: string;
        content: string;
    }

    let articles: Article[] = [];
    let headlines: string[] = [];

    onMount(async () => {
        // Fetch articles and headlines from your API
        const apiRoot = import.meta.env.VITE_API_ROOT;
        const response = await fetch(`${apiRoot}/api/Admin/AssignmentCorrectHeadline/GetCorrectHeadlinesByCategory?categoryId=1`);
        if (response.ok) {
            articles = await response.json();
            headlines = articles.map(article => article.headline);
        } else {
            console.error('Failed to fetch articles:', response.statusText);
        }
    });

    function handleDrop(data, node) {
        const articleId = parseInt(node.dataset.articleId, 10);
        const article = articles.find(article => article.id === articleId);
        if (article) {
            article.headline = data;
        }
    }
</script>

<style>
    .headline {
        padding: 10px;
        margin: 5px;
        background-color: #f0f0f0;
        cursor: grab;
    }

    .article {
        padding: 10px;
        margin: 5px;
        border: 1px solid #ddd;
        min-height: 100px;
    }

    .drop-zone {
        padding: 10px;
        margin-bottom: 10px;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
    }

    .column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    ul {
        display: flex;
    }

    .drop-zone:global(.droppable) {
        border: 2px dashed #ccc;
        outline-offset: 0.25rem;
        background-color: #cc1919;
    }
</style>

<h1>spoj to uz konecne</h1>

<div class="headlines">
    <ul>
        {#each headlines as headline}
            <div class="headline">
                <li class="column" use:draggable={{ data: headline }}>
                    {headline}
                </li>
            </div>
        {/each}
    </ul>
</div>

<div class="articles">
    <ul>
        {#each articles as article}
            <div class="article">
                <div class='drop-zone' use:dropzone={{ onDrop: handleDrop }} data-article-id={article.id}></div>
                <li class='column'>
                    {article.content}
                </li>
            </div>
        {/each}
    </ul>
</div>