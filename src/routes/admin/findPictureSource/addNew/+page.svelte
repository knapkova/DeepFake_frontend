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
    <a href="/admin/findPictureSource" class="back-link">Zpět na seznam</a>
    <h2>Vytvořit úkol najdi zdroj k obrázku</h2>
    <p>Vyplňte prosím níže uvedený formulář pro vytvoření nového úkolu najdi zdroj k obrázku. Ujistěte se, že jste zadali všechny povinné údaje.</p>
    <div class="form-group">
        <label for="ImgTitle">Nadpis</label>
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