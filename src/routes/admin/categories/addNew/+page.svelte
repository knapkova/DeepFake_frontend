<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms';
    import '../../../../styles/form.css'

    export let data: PageData;
    const { form, errors, message } = superForm(data.form);

</script>

{#if $message}
    <div class="update-message">{$message}</div>
{/if}

<form use:enhance method="post" class="form-container" enctype="multipart/form-data">
    <a href="/admin/categories" class="back-link">Zpět na seznam</a>
    <h2>Vytvořit novou kategorii</h2>
    <p>Vyplňte prosím níže uvedený formulář.</p>
    <div class="form-group">
        <label for="Name">Název kategorie</label>
        <input id="Name"
               type="text"
               name="Name"
               bind:value={$form.Name}
               required
               class="form-control"
               placeholder="Vložte název"
        />
        {#if $errors.Name}
            <div class="error">{$errors.Name}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="Description">Popis kategorie</label>
        <textarea id="Description"
                  name="Description"
                  bind:value={$form.Description}
                  required
                  class="form-control"
                  placeholder="Vložte popis"
        ></textarea>
        {#if $errors.Description}
            <div class="error">{$errors.Description}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="Duration">Délka [min]</label>
        <input id="Duration"
               type="number"
               name="Duration"
               bind:value={$form.Duration}
               required
               class="form-control"
               placeholder="Vložte délku"
        />
        {#if $errors.Duration}
            <div class="error">{$errors.Duration}</div>
        {/if}

    </div>

    <div class="form-group">
        <label for="Visible">Zobrazit</label>
        <input id="Visible"
               type="checkbox"
               name="Visible"
               bind:checked={$form.Visible}
               class="form-control"
        />
        {#if $errors.Visible}
            <div class="error">{$errors.Visible}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="Image">Úvodní fotografie</label>
        <input id="Image"
               type="file"
               name="Image"
               accept=".jpg, .jpeg, .png, .webp"
               bind:value={$form.Image}
               required
               class="form-control" />
        {#if $errors.Image}
            <div class="error">{$errors.Image}</div>
        {/if}
    </div>
    <button type="submit" class="btn-submit">Vytvořit úkol</button>



</form>
