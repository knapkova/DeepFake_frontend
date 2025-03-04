<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms';
    import { writable } from 'svelte/store';

    // `data` comes from the server load function
    export let data: PageData;
    const { form, errors, message } = superForm(data.form);

    interface ManipulativePart {
        startIndex: number;
        endIndex: number;
        reason: string;
    }

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

<form use:enhance method="post" class="form-container">
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

    <input type="hidden" name="manipulativeParts" value={JSON.stringify($manipulativeParts)} />


    <button type="submit" class="btn-submit">Vytvořit úkol</button>
</form>

{#if $message}
    <div class="update-message">{$message}</div>
{/if}

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

    .btn-add {
        display: inline-block;
        padding: 5px 10px;
        font-size: 14px;
        color: #fff;
        background-color: #28a745;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-bottom: 10px;
    }

    .btn-add:hover {
        background-color: #218838;
    }

    .btn-remove {
        display: inline-block;
        padding: 5px 10px;
        font-size: 14px;
        color: #fff;
        background-color: #dc3545;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 10px;
    }

    .btn-remove:hover {
        background-color: #c82333;
    }

    .manipulative-part {
        margin-bottom: 15px;
        padding: 10px;
        background: #f1f1f1;
        border-radius: 4px;
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

    .cursor-info {
        margin-top: 10px;
        font-size: 14px;
        color: #666;
    }
</style>