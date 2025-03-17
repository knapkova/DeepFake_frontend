<script lang="ts">
        import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms';
    import { writable } from 'svelte/store';
    import type { Category } from '$types/interfaces';
    import { onMount } from 'svelte';

    import '../../../../styles/form.css'
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    
    export let data: PageData;
    const { form, errors, message } = superForm(data.form);
    let categories = writable<Category[]>([]);


    onMount(async () => {
      const response = await fetch(PUBLIC_VITE_API_ROOT + '/api/Admin/Categories/GetCategories');
      const data = await response.json();
      categories.set(data);
      console.log(data);
    });


</script>
<div>
    {#if $message}
    <div class="update-message">{$message}</div>
    {/if}
    <a href="/admin/cognitiveBias" class="back-link">Zpět na seznam</a>

    <form use:enhance method="post" class="form-container">
        <h2>Vytvořit kognitivní zkreslení</h2>
        <p>Vyplňte prosím níže uvedený formulář pro vytvoření nového kognitivního zkreslení.</p>
        <div class="form-group">
            <label for="name">Název</label>
            <input 
                type="text" 
                id="CognitiveBias" 
                name="CognitiveBias" 
                required 
                bind:value={$form.CognitiveBias} 
                class="form-control" 
                placeholder="vložte název zkreslení"
                />
            {#if $errors.CognitiveBias}
            <div class="error-message">{$errors.CognitiveBias}</div>
            {/if}
        </div>

        <div class="form-group">
            <label for="Definition">Definice</label>
            <input
                type="text" 
                id="Definition" 
                name="Definition" 
                required 
                bind:value={$form.Definition} 
                class="form-control" 
                placeholder="vložte definici zkreslení"
                />
            {#if $errors.Definition}
            <div class="error-message">{$errors.Definition}</div>
            {/if}
        </div>

        <div class="form-group">
            <label for="Example">Příklad</label>
            <textarea 
                id="Example" 
                name="Example" 
                required 
                bind:value={$form.Example} 
                class="form-control" 
                placeholder="vložte příklad zkreslení"
                ></textarea>
            {#if $errors.Example}
            <div class="error-message">{$errors.Example}</div>
            {/if}
        </div>

        <div class="form-group">
            <label for="Visible">Zobrazit?</label>
            <input 
                type="checkbox" 
                id="Visible" 
                name="Visible" 
                bind:checked={$form.Visible} 
                class="form-control" 
                />
            {#if $errors.Visible}
            <div class="error-message">{$errors.Visible}</div>
            {/if}   
        </div>


        <div class="form-group">
            <label for="CatCategoryIdegory">Kategorie</label>
            <select 
                id="CategoryId" 
                name="CategoryId" 
                required 
                bind:value={$form.CategoryId} 
                class="form-control"
                >
                <option value="">Vyberte kategorii</option>
                {#each $categories as category}
                <option value={category.id}>{category.name}</option>
                {/each}
            </select>
            {#if $errors.CategoryId}
            <div class="error-message">{$errors.CategoryId}</div>
            {/if}
        </div>
        <button type="submit" class="btn-submit">Vytvořit úkol</button>
    </form>
</div>