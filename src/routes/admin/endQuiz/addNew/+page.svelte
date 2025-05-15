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
        answer: string;
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
        answer.update(ans => [...ans, { answer: '', correct: false }]);
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
    <a href="/admin/endQuiz" class="back-link">Zpět na seznam</a>
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
        <select id="categoryId" name="categoryId" bind:value={$form.categoryId} class="form-control">
            {#each $categories as category}
                <option value={category.id}>{category.name}</option>
            {/each}
        </select>
        {#if $errors.categoryId}
            <div class="error">{$errors.categoryId}</div>
        {/if}
    </div>

    <div class="form-group">
        <label>Odpovědi</label>
        {#each $answer as ans, index}
            <div class="answer-group">
                <input type="text" id="answer-{index}" name="answer" bind:value={ans.answer}
                class="form-control answer-input"
                placeholder="Zadejte odpověď"
                />
                <label for="correct-{index}" class="correct-label">Správně?</label>
                <input type="checkbox" id="correct-{index}" name="correct" bind:checked={ans.correct} 
                class="correct-checkbox" on:change={() => handleCorrectAnswerChange(index)}
                />
                <button type="button" on:click={() => removeAnswer(index)} class="btn-remove">Odstranit</button>
            </div>
        {/each}
        <button type="button" on:click={addAnswer} class="btn-add">Přidat odpověď</button>
    </div>

    <input type="hidden" name="answer" value={JSON.stringify($answer)} />

    <button type="submit" class="btn-submit">Vytvořit otázku</button>
</form>

<style>
    .form-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .form-container h2 {
        text-align: center;
        margin-bottom: 20px;
    }

    .form-container p {
        text-align: center;
        margin-bottom: 20px;
        color: #666;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .form-control {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    }

    .form-control:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    .answer-group {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .answer-input {
        flex: 2;
        margin-right: 10px;
    }

    .correct-label {
        margin-right: 10px;
    }

    .correct-checkbox {
        width: auto;
        margin-right: 10px;
        padding: 7px;
    }

    .btn-remove {
        background-color: #dc3545;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn-remove:hover {
        background-color: #c82333;
    }

    .btn-add {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .btn-add:hover {
        background-color: #0056b3;
    }

    .btn-submit {
        display: inline-block;
        width: 100%;
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .btn-submit:hover {
        background-color: #0056b3;
    }

    .error {
        color: #ff0000;
        margin-top: 5px;
    }

    .update-message {
        margin-top: 20px;
        padding: 10px;
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
    }
</style>