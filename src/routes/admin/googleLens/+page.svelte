<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import '../../../styles/admin.css';
    import * as db from '$lib/db/lens';

    let updateMessage: string = '';
    let fetchError: string = '';
    let loading = true;

    let photos = writable<db.LensPhoto[]>([]);

    onMount(async () => {
        try {
            photos.set(await db.getLensPhotosWithAnswers());
        } catch {
            fetchError = 'Nepodařilo se načíst záznamy. Zkuste stránku obnovit.';
        } finally {
            loading = false;
        }
    });

    async function deletePhoto(id: number) {
        if (!confirm('Opravdu chcete smazat tuto položku?')) return;
        try {
            await db.deleteLensPhoto(id);
            photos.update(items => items.filter(item => item.id !== id));
            updateMessage = `Položka ${id} smazána.`;
        } catch (e) {
            console.error(e);
            updateMessage = `Nepodařilo se smazat položku ${id}.`;
        }
    }
</script>

<a href="/admin" class="back-link">Zpět na přehled</a>
<h2>Google Lens - najdi zdroj k obrázku</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

{#if loading}
    <p class="status-message">Načítání...</p>
{:else if fetchError}
    <p class="status-message error" role="alert">{fetchError}</p>
{:else}
    <button onclick={() => window.location.href = '/admin/googleLens/addNew'}>+ Přidat nové</button>
    <div class="admin-section">
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Obrázek</th>
                    <th>Správná odpověď</th>
                    <th>Uznávané odpovědi</th>
                    <th>Kategorie</th>
                    <th>Akce</th>
                </tr>
            </thead>
            <tbody>
                {#each $photos as photo (photo.id)}
                    <tr>
                        <td>{photo.id}</td>
                        <td><img src={photo.imgSrc} alt="" width="200px" /></td>
                        <td>{photo.correctAnswer}</td>
                        <td>{photo.acceptedAnswers.join(', ')}</td>
                        <td>{photo.categoryId}</td>
                        <td>
                            <button onclick={() => deletePhoto(photo.id)}>Smazat</button>
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
