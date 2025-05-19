<script lang="ts">
    import { onMount } from 'svelte';
    import HorizontalList from '$lib/dnd_HorizontalList.svelte';

    interface Article {
        id: number;
        content: string;
        correctHeadline: string;
        userHeadline?: { id: number, text: string }; // Store dropped headline
        isCorrect?: boolean | null; // Track correctness
    }

    let articles: Article[] = [];
    let headlines: { id: number, text: string }[] = [];
    let resultMessage = ""; // Message to show after checking answers

    onMount(async () => {
        const apiRoot = import.meta.env.VITE_API_ROOT;
        const response = await fetch(`${apiRoot}/api/Admin/AssignmentCorrectHeadline/GetCorrectHeadlinesByCategory?categoryId=1`);
        
        if (response.ok) {
            const fetchedArticles = await response.json();

            // Initialize articles with empty userHeadline
            articles = fetchedArticles.map(article => ({
                id: article.id,
                content: article.content,
                correctHeadline: article.headline,
                userHeadline: null
            }));

            // Prepare headlines list
            headlines = articles.map(article => ({ id: article.id, text: article.correctHeadline }));

            console.log('Fetched articles:', articles);
            console.log('Fetched headlines:', headlines);
        } else {
            console.error('Failed to fetch articles:', response.statusText);
        }
    });

    function handleDrop({ items }, article) {
        console.log("handleDrop called", items);

        const droppedHeadline = items[0]; // Get first dropped item

        if (droppedHeadline) {
            // Remove from available headlines
            headlines = headlines.filter(h => h.id !== droppedHeadline.id);

            // Assign to article
            article.userHeadline = { id: droppedHeadline.id, text: droppedHeadline.text };

            // Reset correctness state
            article.isCorrect = null;
            resultMessage = "";

            console.log("Updated article:", article);
        }
    }
    

    function checkAnswers() {
        let correctCount = 0;
        
        articles.forEach(article => {
            if (article.userHeadline && article.userHeadline.text === article.correctHeadline) {
                article.isCorrect = true;
                correctCount++;
            } else {
                article.isCorrect = false;
            }
        });

        resultMessage = `You got ${correctCount} out of ${articles.length} correct!`;
    }
</script>

<h1>spoj to uz konecne</h1>
<HorizontalList 
    items={headlines} 
    singleSelection={false} 
/>

<div class="articles">
    <h2>Articles</h2>
    <ul>
        {#each articles as article}
            <div class="article">
                <HorizontalList 
                    singleSelection={true} 
                    items={article.userHeadline ? [article.userHeadline] : []} 
                    onItemDropped={(e) => handleDrop(e, article)}
                />
                <li class="column">{article.content}</li>
            </div>
        {/each}
    </ul>
</div>

<!-- Check Answers Button -->
<button class="check-button" on:click={checkAnswers}>Check Answers</button>

<!-- Display Result Message -->
{#if resultMessage}
    <div class="result">{resultMessage}</div>
{/if}
