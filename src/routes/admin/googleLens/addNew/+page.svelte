<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import type { Category } from '$types/interfaces';
    import { superForm } from 'sveltekit-superforms';
    import '../../../../styles/form.css'

    import { getCategories } from '$lib/db/categories';

    export let data: PageData;
    const { form, errors, message } = superForm(data.form);


    let categories = writable<Category[]>([]);
  
    onMount(async () => {
        categories.set(await getCategories());
    });

</script>

{#if $message}
    <div class="update-message">{$message}</div>
    {/if}


<form use:enhance method="post" class="form-container" enctype="multipart/form-data">
    <a href="/admin/googleLens" class="back-link">Zpět na seznam</a>
    <h2>Nový obrázek pro Google Lens</h2>
    <p>Hráč obrázek prohledá v Google Lens a napíše, odkud pochází. Odpověď se porovná se seznamem uznávaných odpovědí (bez ohledu na velká/malá písmena).</p>

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
        <label for="Image">Obrázek</label>
        <input
            id="Image"
            type="file"
            name="Image"
            accept=".jpg, .jpeg, .png, .webp"
            bind:value={$form.Image}
            required
            class="form-control"
        />
        {#if $errors.Image}
            <div class="error">{$errors.Image}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="correctAnswer">Správná odpověď (ukáže se po 3 neúspěšných pokusech)</label>
        <input
            id="correctAnswer"
            type="text"
            name="correctAnswer"
            bind:value={$form.correctAnswer}
            required
            class="form-control"
            placeholder="např. Wadi Rum, Jordánsko"
        />
        {#if $errors.correctAnswer}
            <div class="error">{$errors.correctAnswer}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="acceptedAnswers">Uznávané odpovědi (každá na nový řádek)</label>
        <textarea
            id="acceptedAnswers"
            name="acceptedAnswers"
            bind:value={$form.acceptedAnswers}
            required
            class="form-control"
            placeholder={'Wadi Rum\nWadi Rum, Jordánsko\njordánsko'}
        ></textarea>
        {#if $errors.acceptedAnswers}
            <div class="error">{$errors.acceptedAnswers}</div>
        {/if}
    </div>

    <button type="submit" class="btn-submit">Vytvořit</button>
</form>