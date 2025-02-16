<script lang="ts">
    import { onMount } from 'svelte';
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import HorizontalList from '$lib/dnd_HorizontalList.svelte';


    interface Article {
        id: number;
        headline: string;
        content: string;
        correctHeadline: string; // Add this property to store the correct headline
    }

    let userAnswers: { [key: number]: string } = {}; // New structure to keep track of user's answers
    let isCorrect: boolean | null = null; // To store the result of the check
    let articles: Article[] = [];
    let headlines: { id: number, text: string }[] = [];
    const flipDurationMs = 300;

    onMount(async () => {
        // Fetch articles and headlines from your API
        const apiRoot = import.meta.env.VITE_API_ROOT;
        const response = await fetch(`${apiRoot}/api/Admin/AssignmentCorrectHeadline/GetCorrectHeadlinesByCategory?categoryId=1`);
        if (response.ok) {
            const fetchedArticles = await response.json();
            articles = fetchedArticles.map(article => ({
                ...article,
                correctHeadline: article.headline,
                headline: '' // Initialize headline as empty for user answers
            }));
            headlines = articles.map(article => ({ id: article.id, text: article.correctHeadline }));
            console.log('Fetched articles:', articles);
            console.log('Fetched headlines:', headlines);
        } else {
            console.error('Failed to fetch articles:', response.statusText);
        }
    });

    function handleDndConsider(event) {
        // Handle the consider event
    }

    function handleDndFinalize(event) {
        // Handle the finalize event
    }

    function handleDrop(event) {
        const articleId = event.detail.item.dataset.articleId;
        const headline = event.detail.item.innerText;
        userAnswers[articleId] = headline;
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
        max-width: fit-content;
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
<HorizontalList items={headlines}/>


<div class="articles">
    <h2>Articles</h2>
    <ul>
        {#each articles as article}
            <div class="article">
                <div class='drop-zone' use:dndzone={{ items: articles, flipDurationMs }} on:drop={handleDrop} data-article-id={article.id}>
                    {userAnswers[article.id] || 'Drop headline here'}
                </div>
                <li class='column'>
                    {article.content}
                </li>
            </div>
        {/each}
    </ul>
</div>