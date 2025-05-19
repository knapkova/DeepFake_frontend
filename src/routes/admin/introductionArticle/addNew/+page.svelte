<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms';
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import type { Category } from '$types/interfaces';
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
<div>
    {#if $message}
    <div class="update-message">{$message}</div>
    {/if}

    <form use:enhance method="post" class="form-container" enctype="multipart/form-data">
        <a href="/admin/introductionArticle" class="back-link">Zpět na seznam</a>
        
        <h2>Vytvořit nový úvodní článek</h2>
        <p>Vyplňte prosím níže uvedený formulář pro vytvoření nového úvodního článku. Ujistěte se, že jste zadali všechny povinné údaje.</p>
    
        <div class="form-group
        ">
            <label for="Title">Nadpis</label>
            <input
                id="Title"
                type="text"
                name="Title"
                bind:value={$form.Title}
                required
                class="form-control"
                placeholder="Vložte název"
            />
            {#if $errors.Title}
                <div class="error">{$errors.Title}</div>
            {/if}
        </div>
          
        <div class="form-group">
            <label for="Content">Content</label>
            <textarea
                id="Content"
                name="Content"
                bind:value={$form.Content}
                required
                class="form-control"
                placeholder="Vložte Content"
            ></textarea>
            {#if $errors.Content}
                <div class="error">{$errors.Content}</div>
            {/if}
        </div>

        <div class="form-group">
            <label for="Image">Image</label>
            <input
                id="Image"
                type="file"
                name="Image"
                accept=".jpg, .jpeg, .png, .webp" 
                required
                class="form-control"
                placeholder="Vložte Image"
            />
            {#if $errors.Image}
                <div class="error">{$errors.Image}</div>
            {/if}
        </div>

        <div class="form-group">
            <label for="Instructions">Instructions</label>
            <input
                id="Instructions"
                type="text"
                name="Instructions"
                bind:value={$form.Instructions}

                class="form-control"
                placeholder="Vložte instruction"
            />
            {#if $errors.Instructions}
                <div class="error">{$errors.Instructions}</div>
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
        <button type="submit" class="btn-submit">Vytvořit úkol</button>


    </form>




</div>