<script lang="ts">

    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms';
    import '../../../../styles/form.css'
    import type { Category } from '$types/interfaces';
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

const assignmentTypes = [
        { value: 1, label: 'Assignment Correct Headline' },
        { value: 2, label: 'Assignment Manipulative Text' },
        { value: 3, label: 'Assignment Introduction Articles' },
        { value: 4, label: 'Assignment Find Picture Source' },
        { value: 5, label: 'Show Results' },
        { value: 6, label: 'After Assignment Results' },
        { value: 7, label: 'Final Results' }
    ];

</script>

{#if $message}
    <div class="update-message">{$message}</div>
{/if}

<form use:enhance method="post" class="form-container">
    <a href="/admin/categoriesAssignments" class="back-link">Zpět na seznam</a>
    <h2>Přiřadit kategorii</h2>
    <p>Vyplňte prosím níže uvedený formulář.</p>
    <div class="form-group">
        <label for="CategoryId">Kategorie</label>
        <select id="CategoryId" name="CategoryId" bind:value={$form.CategoryId} required class="form-control">
            <option value="">Vyberte kategorii</option>
            {#each $categories as category}
                <option value={category.id}>{category.name}</option>
            {/each}
        </select>
        {#if $errors.CategoryId}
            <div class="error">{$errors.CategoryId}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="OrderIndex">Pořadí</label>
        <input id="OrderIndex" type="number" name="OrderIndex" bind:value={$form.OrderIndex} required class="form-control" placeholder="Pořadí" />
        {#if $errors.OrderIndex}
            <div class="error">{$errors.OrderIndex}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="AssignmentType">Typ úkolu</label>
        <select id="AssignmentType" name="AssignmentType" bind:value={$form.AssignmentType} required class="form-control">
            <option value="">Vyberte typ úkolu</option>
            {#each assignmentTypes as type}
                <option value={type.value}>{type.label}</option>
            {/each}
        </select>
        {#if $errors.AssignmentType}
            <div class="error">{$errors.AssignmentType}</div>
        {/if}


        <button type="submit" class="btn-submit">Přiřadit</button>

</form>