<script lang="ts">
    import type {QuestionEndQuiz,answersEndQuiz} from '$types/interfaces';   
    import {PUBLIC_VITE_API_ROOT} from '$env/static/public';
    import { readable, writable } from 'svelte/store';
    import { onMount } from 'svelte';


    let category_id = 6;

    const api_get_by_category = "/api/AssignmentQuiz/GetQuestionsByCategoryId/"
    let questions = writable<QuestionEndQuiz[]>([]);
    onMount(async () => {
        const response = await fetch(PUBLIC_VITE_API_ROOT + api_get_by_category + category_id);
        const data = await response.json();
        data.forEach((item: QuestionEndQuiz) => {
            item.answer = JSON.parse(item.answer as unknown as string) as answersEndQuiz[];
        });
        questions.set(data);
    });
    console.log(questions)


    let state = 'start'
    </script>
    
    {#if state=='start'}
        <div class="endquiz-start">
            <h2>Závěrečný kvíz</h2>
            <p>Jste připraveni zopakovat si, co jste se naučili?</p>
    
            <button on:click={() => state = 'quiz'}>Začít kvíz</button>
        </div>
        {:else if state=='quiz'}
        <!-- <PageProgress /> -->
        <div class="endquiz-quiz">
                {#each $questions as question}
                    <h4>{question.question}</h4>
                    <ul>
                        {#each question.answer as answer}
                        <li>{answer.answer} {answer.correct ? '✅' : '❌'}</li>
                        {/each}
                    </ul>
                    {/each}
            </div>
            <button on:click={() => state = 'result'}>Vyhodnotit</button>

    {/if}		