<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms';
    import { writable } from 'svelte/store';
    import type { Category } from '$types/interfaces';
    import { onMount } from 'svelte';

    import '../../../../styles/form.css'
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';


    // `data` comes from the server load function
    export let data: PageData;
    const { form, errors, message } = superForm(data.form);

    interface ManipulativePart {
        startIndex: number;
        endIndex: number;
        reason: string;
    }

    let categories = writable<Category[]>([]);
  
    onMount(async () => {
        const request_get = '/api/Admin/Categories/GetCategories';

        const response = await fetch(PUBLIC_VITE_API_ROOT + request_get); 
        const data = await response.json();
        categories.set(data);
        console.log(data);
    });

    let manipulativeParts = writable<ManipulativePart[]>([]);
    let cursorPosition = writable({ start: 0, end: 0 });

    function addManipulativePart() {
        manipulativeParts.update(parts => [...parts, { startIndex: 0, endIndex: 0, reason: '' }]);
    }

    function removeManipulativePart(index) {
        manipulativeParts.update(parts => parts.filter((_, i) => i !== index));
    }

    function updateCursorPosition(event) {
        cursorPosition.set({ start: event.target.selectionStart, end: event.target.selectionEnd });
    }
   
</script>
<div>
    {#if $message}
    <div class="update-message">{$message}</div>
    {/if}
<form use:enhance method="post" class="form-container">
    <a href="/admin/manipulativeText" class="back-link">Zpět na seznam</a>
    
    <h2>Vytvořit úkol s manipulativním textem</h2>
    <p>Vyplňte prosím níže uvedený formulář pro vytvoření nového úkolu s manipulativním textem. Ujistěte se, že jste zadali manipulativní části s jejich příslušnými počátečními a koncovými indexy a zdůvodnení daného výběru (např. použitá manipulační technika).</p>

    <div class="form-group">
        <label for="header">Nadpis</label>
        <input
            id="header"
            type="text"
            name="header"
            bind:value={$form.header}
            required
            class="form-control"
            placeholder="Vložte název"
        />
        {#if $errors.header}
            <div class="error">{$errors.header}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="text">Text</label>
        <textarea
            id="text"
            name="text"
            bind:value={$form.text}
            required
            class="form-control"
            placeholder="Vložte text"
            on:click={updateCursorPosition}
            on:keyup={updateCursorPosition}
        ></textarea>
        {#if $errors.text}
            <div class="error">{$errors.text}</div>
        {/if}
        <div class="cursor-info">
            Pozice kurzoru: {$cursorPosition.start} - {$cursorPosition.end}
        </div>
    </div>

    <div class="form-group">
        <label>Manipulativní části</label>
        <button type="button" on:click={addManipulativePart} class="btn-add">Přidat část</button>
        {#each $manipulativeParts as part, index}
        {console.log(part)}
        {console.log(JSON.stringify($manipulativeParts))}
            <div class="manipulative-part">
                <label>Počáteční index</label>
                <input type="number" class="form-control" bind:value={part.startIndex} placeholder="Počáteční index" />
                <label>Koncový index</label>
                <input type="number" class="form-control" bind:value={part.endIndex} placeholder="Koncový index" />
                <label>Důvod</label>
                <input type="text"  class="form-control" bind:value={part.reason}  placeholder="Důvod" />
                <button type="button" on:click={() => removeManipulativePart(index)} class="btn-remove">Odstranit</button>
            </div>
        {/each}
        {#if $errors.manipulativeParts}
            <div class="error">{$errors.manipulativeParts}</div>
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

    <input type="hidden" name="manipulativeParts" value={JSON.stringify($manipulativeParts)} />


    <button type="submit" class="btn-submit">Vytvořit úkol</button>
</form>



</div>
