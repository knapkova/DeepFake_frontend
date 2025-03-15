<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { writable } from 'svelte/store';
	import '../../../../styles/form.css';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import type { Category } from '$types/interfaces';

	export let data: PageData;
    let correctAnswerCount = 0;
	const { form, errors, message } = superForm(data.form);

	// Fetch categories (if your schema uses them)
	let categories = writable<Category[]>([]);

	onMount(async () => {
		const response = await fetch(PUBLIC_VITE_API_ROOT + '/api/Admin/Categories/GetCategories');
		const data = await response.json();
		categories.set(data);
		console.log(data);
	});

	// Functions to update dynamic "answers" inside the form store.
	function addAnswer() {
		form.update((f) => {
			// Ensure answers is an array (the schema requires at least one answer)
			const newAnswers = f.answers ? [...f.answers, { Answer: '', correct: false }] : [{ Answer: '', correct: false }];
			return { ...f, answers: newAnswers };
		});
	}

	function removeAnswer(index: number) {
		form.update((f) => {
			const newAnswers = f.answers.filter((_: any, i: number) => i !== index);
			return { ...f, answers: newAnswers };
		});
	}

    function handleCorrectAnswerChange(index: number) {
        form.update((f) => {
            const newAnswers = f.answers.map((answer: any, i: number) => ({
                ...answer,
                correct: i === index
            }));
            return { ...f, answers: newAnswers };
        });
    }
</script>

{#if $message}
	<div class="update-message">{$message}</div>
{/if}

<form use:enhance method="post" class="form-container" enctype="multipart/form-data">
	<a href="/admin/findPictureSource" class="back-link">Zpět na seznam</a>
	<h2>Vytvořit otázku</h2>
	<p>Vyplňte prosím níže uvedený formulář pro vytvoření nové otázky s odpověďmi.</p>

	<div class="form-group">
		<label for="Question">Otázka</label>
		<input
			id="Question"
			type="text"
			name="Question"
			bind:value={$form.Question}
			required
			class="form-control"
			placeholder="Zadejte otázku"
		/>
		{#if $errors.Question}
			<div class="error">{$errors.Question}</div>
		{/if}
	</div>

	<div class="form-group">
		<label for="CategoryId">Kategorie</label>
		<select id="CategoryId" name="categoryId" bind:value={$form.categoryId} class="form-control">
			{#each $categories as category}
				<option value={category.id}>{category.name}</option>
			{/each}
		</select>
		{#if $errors.categoryId}
			<div class="error">{$errors.categoryId}</div>
		{/if}
	</div>

	<h3>Odpovědi</h3>
	{#each $form.answers as answer, index (index)}
		<div class="form-group answer-group">
			<label for="answers-{index}-Answer">Odpověď {index + 1}</label>
			<input
				id="answers-{index}-Answer"
				type="text"
				name={`answers[${index}].Answer`}
				bind:value={$form.answers[index].Answer}
				required
				class="form-control"
				placeholder="Zadejte odpověď"
			/>
			{#if $errors.answers && $errors.answers[index] && $errors.answers[index].Answer}
				<div class="error">{$errors.answers[index].Answer}</div>
			{/if}
			<div class="form-group checkbox-group">
                <label for="answers-{index}-correct">Správná odpověď?</label>
                <input
                    id="answers-{index}-correct"
                    type="checkbox"
                    name={`answers[${index}].correct`}
                    on:change={() => handleCorrectAnswerChange(index)}
                    bind:checked={$form.answers[index].correct}
                />
            </div>
			<button type="button" on:click={() => removeAnswer(index)} class="btn-remove">Odstranit odpověď</button>
		</div>
	{/each}
	<button type="button" on:click={addAnswer} class="btn-add">Přidat odpověď</button>

	<button type="submit" class="btn-submit">Vytvořit otázku</button>
</form>
