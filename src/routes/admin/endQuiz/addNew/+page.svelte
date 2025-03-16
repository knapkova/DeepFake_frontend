<script lang="ts">
    import SuperDebug from 'sveltekit-superforms';
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { superForm } from 'sveltekit-superforms';
    import { writable } from 'svelte/store';
    import '../../../../styles/form.css';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import type { Category } from '$types/interfaces';
  
    export let data: PageData;
    const { form, errors, message } = superForm(data.form);
    
    interface Answer {
        answer: number;
        correct: boolean;

    }

    let categories = writable<Category[]>([]);
    onMount(async () => {
      const response = await fetch(PUBLIC_VITE_API_ROOT + '/api/Admin/Categories/GetCategories');
      const data = await response.json();
      categories.set(data);
      console.log(data);
    });

    let answer = writable<Answer[]>([]);
    function addAnswer() {
        answer.update(ans => [...ans, { answer: 0, correct: false }]);
    }

    function removeAnswer(index: number) {
        answer.update(ans => ans.filter((_, i) => i !== index));
    }

    function handleCorrectAnswerChange(index: number) {
        answer.update(ans => ans.map((answer, i) => ({
            ...answer,
            correct: i === index
        })));
    }


 
      
  </script>
  
  {#if $message}
    <div class="update-message">{$message}</div>
  {/if}
  
  <form use:enhance method="post" class="form-container">
    <a href="/admin/findPictureSource" class="back-link">Zpět na seznam</a>
    <h2>Vytvořit otázku</h2>
    <p>Vyplňte prosím níže uvedený formulář pro vytvoření nové otázky s odpověďmi.</p>
    
    <div class="form-group">
        <label for="question">Otázka</label>
        <input type="text" id="question" name="question" bind:value={$form.question}
        class="form-control"
        placeholder="Zadejte otázku"
        />
        {#if $errors.question}
            <div class="error">{$errors.question}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="categoryId">Kategorie</label>
        <select id="categoryId" name="categoryId">
            {#each $categories as category}
                            <option value={category.id}>{category.name}</option>
            {/each}
        </select>
        {#if $errors.categoryId}
            <div class="error">{$errors.categoryId}</div>
        {/if}
    </div>

    <div class="form-group">
        {#each $answer as ans, index}
            <div class="answer-group">
                <label for="correct">Odpověď</label>
                <input type="text" id="answer" name="answer" bind:value={ans.answer}
                class="form-control"
                placeholder="Zadejte odpověď"
                />
                <label for="correct">Správná odpověď?</label>
                <input type="checkbox" id="correct" name="correct" bind:checked={ans.correct} 
                class="form-control"                     on:change={() => handleCorrectAnswerChange(index)}

                />
                <button type="button" on:click={() => removeAnswer(index)} class="btn-remove">Odstranit</button>
            </div>
        {/each}
        <button type="button" on:click={addAnswer} class="btn-add">Přidat odpověď</button>


    </div>

    <input type="hidden" name="answer" value={JSON.stringify($answer)} />



  
    <button type="submit" class="btn-submit">Vytvořit otázku</button>
  </form>
  