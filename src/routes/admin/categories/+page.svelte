<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import '../../../styles/admin.css';
    import type { Category } from '$types/interfaces';
    import * as db from '$lib/db/categories';

    let updateMessage: string = '';
    let fetchError: string = '';
    let loading = true;

    let categories = writable<Category[]>([]);

    onMount(async () => {
        try {
            categories.set(await db.getCategories());
        } catch {
            fetchError = 'Nepodařilo se načíst kategorie. Zkuste stránku obnovit.';
        } finally {
            loading = false;
        }
    });

    async function updateCategory(category: Category, imageFile: File | null) {
        try {
            await db.updateCategory(category, imageFile);
            updateMessage = `Kategorie ${category.id} úspěšně upravena!`;
        } catch (e) {
            console.error(e);
            updateMessage = `Nepodařilo se upravit kategorii ${category.id}.`;
        }
    }

    async function deleteCategory(id: number) {
        if (!confirm('Opravdu chcete smazat tuto kategorii?')) return;

        try {
            await db.deleteCategory(id);
            categories.update(cats => cats.filter(cat => cat.id !== id));
            updateMessage = `Kategorie ${id} smazána.`;
        } catch (e) {
            console.error(e);
            updateMessage = `Nepodařilo se smazat kategorii ${id}.`;
        }
    }
</script>

<a href="/admin" class="back-link">Zpět na přehled</a>
<h2>Úprava kategorií</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

{#if loading}
    <p class="status-message">Načítání...</p>
{:else if fetchError}
    <p class="status-message error" role="alert">{fetchError}</p>
{:else}
    <button on:click={() => window.location.href = '/admin/categories/addNew'}>+ Přidat nové</button>
    <div class="admin-section">
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Název</th>
                    <th>Popis</th>
                    <th>Délka</th>
                    <th>Zobrazit</th>
                    <th>Úvodní obrázek</th>
                    <th>Akce</th>
                </tr>
            </thead>
            <tbody>
                {#each $categories as category (category.id)}
                    <tr>
                        <td>{category.id}</td>
                        <td>
                            <input type="text" bind:value={category.name} placeholder="Název" />
                        </td>
                        <td>
                            <input type="text" bind:value={category.description} placeholder="Popis" />
                        </td>
                        <td>
                            <input type="number" bind:value={category.duration} placeholder="Délka" />
                        </td>
                        <td>
                            <input type="checkbox" bind:checked={category.visible} />
                        </td>
                        <td>
                            <a href="{category.imgSrc}" target="_blank">Otevřít</a>
                        </td>
                        <td>
                            <button on:click={() => updateCategory(category, null)}>Uložit</button>
                            <button on:click={() => deleteCategory(category.id)}>Smazat</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}

<style>
    .status-message { padding: 1rem; }
    .status-message.error { color: #dc2626; }
</style>
