<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import type { Category } from '$types/interfaces';
    import { superForm } from 'sveltekit-superforms';
    import '../../../../styles/form.css'
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

    export let data: PageData;
    const { form, errors, message } = superForm(data.form);
    const request_get = '/api/Admin/Categories/GetCategories';


    let categories = writable<Category[]>([]);
  
    onMount(async () => {
        const response = await fetch(PUBLIC_VITE_API_ROOT + request_get); 
        const data = await response.json();
        categories.set(data);
        console.log(data);
    });

</script>

{#if $message}
    <div class="update-message">{$message}</div>
    {/if}

<form use:enhance method="post" class="form-container" enctype="multipart/form-data">
    <a href="/admin/findPictureSource" class="back-link">Zpět na seznam</a>
    <h2>Vytvořit úkol najdi zdroj k obrázku</h2>
    <p>Vyplňte prosím níže uvedený formulář pro vytvoření nového úkolu najdi zdroj k obrázku. Ujistěte se, že jste zadali všechny povinné údaje.</p>
    <div class="form-group">
        <label for="ImgTitle">Správný zdroj</label>
        <input
            id="ImgTitle"
            type="text"
            name="ImgTitle"
            bind:value={$form.ImgTitle}
            required
            class="form-control"
            placeholder="Vložte název"
        />
        {#if $errors.ImgTitle}
            <div class="error">{$errors.ImgTitle}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="visible"> Zobrazit</label>
        <input
            id="visible"
            type="checkbox"
            name="visible"
            bind:checked={$form.visible}
            class="form-control"
    
        />
    </div>

    <div class="form-group">
        <label for="CategoryId">Kategorie</label>
        <select id="CategoryId" name="CategoryId">
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
            <div class="error">{$errors.Image}

            </div>
        {/if}
    </div>
    <div class="form-group">
        <label for="ImgAlt">Alt text</label>
        <input
            id="ImgAlt"
            type="text"
            name="ImgAlt"
            bind:value={$form.ImgAlt}
            required
            class="form-control"
            placeholder="Vložte alt text"/>
        {#if $errors.ImgAlt}
            <div class="error">{$errors.ImgAlt}</div>
        {/if}
    </div>



    <div class="form-group">
        <label for="ImgDescription">Popis</label>
        <textarea
            id="ImgDescription"
            name="ImgDescription"
            bind:value={$form.ImgDescription}
            required
            class="form-control"
            placeholder="Vložte popis"
        ></textarea>
        {#if $errors.ImgDescription}
            <div class="error">{$errors.ImgDescription}</div>
        {/if}

    </div>
    <button type="submit" class="btn-submit">Vytvořit úkol</button>


</form>