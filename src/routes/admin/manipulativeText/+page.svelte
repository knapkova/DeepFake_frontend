<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms';
    // `data` comes from the server load function
    export let data: PageData;
    const { form, errors, message } = superForm(data.form);
</script>

<form use:enhance method="post" class="form-container">
    <div class="form-group">
        <label for="header">Header</label>
        <input
            id="header"
            type="text"
            name="header"
            bind:value={$form.header}
            required
            class="form-control"
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
        ></textarea>
        {#if $errors.text}
            <div class="error">{$errors.text}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="manipulativeParts">Manipulative Parts (JSON)</label>
        <textarea
            id="manipulativeParts"
            name="manipulativeParts"
            bind:value={$form.manipulativeParts}
            required
            class="form-control"
        ></textarea>
        {#if $errors.manipulativeParts}
            <div class="error">{$errors.manipulativeParts}</div>
        {/if}
    </div>

    <button type="submit" class="btn-submit">Vytvořit</button>
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