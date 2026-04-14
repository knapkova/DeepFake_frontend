<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import '../../../styles/admin.css';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

    interface FindPictureSourceItem {
        id: number;
        imgTitle: string;
        imgDescription: string;
        imgAlt: string;
        imgSrc: string;
        visible: boolean;
        categoryId: number;
    }

    let updateMessage: string = '';
    let fetchError: string = '';
    let loading = true;

    const request_get = '/api/Admin/AssignmentFindPictureSource/GetAssignmentFindPictureSources';
    const request_delete = '/api/Admin/AssignmentFindPictureSource/Delete/';

    let findPictureSources = writable<FindPictureSourceItem[]>([]);

    onMount(async () => {
        try {
            const response = await fetch(PUBLIC_VITE_API_ROOT + request_get, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error(`Server vrátil ${response.status}`);
            const data = await response.json();
            findPictureSources.set(data);
        } catch {
            fetchError = 'Nepodařilo se načíst záznamy. Zkuste stránku obnovit.';
        } finally {
            loading = false;
        }
    });

    async function deleteAssignment(id: number) {
        if (!confirm('Opravdu chcete smazat tuto položku?')) return;

        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${request_delete}${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            findPictureSources.update(items => items.filter(item => item.id !== id));
            updateMessage = `Položka ${id} smazána.`;
        } else {
            updateMessage = `Nepodařilo se smazat položku ${id}.`;
        }
    }
</script>

<a href="/admin" class="back-link">Zpět na přehled</a>
<h2>Najdi zdroj k obrázku</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

{#if loading}
    <p class="status-message">Načítání...</p>
{:else if fetchError}
    <p class="status-message error" role="alert">{fetchError}</p>
{:else}
    <button onclick={() => window.location.href = '/admin/findPictureSource/addNew'}>+ Přidat nové</button>
    <div class="admin-section">
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Nadpis</th>
                    <th>Popis</th>
                    <th>Alt</th>
                    <th>Obrázek</th>
                    <th>Viditelné</th>
                    <th>Kategorie</th>
                    <th>Akce</th>
                </tr>
            </thead>
            <tbody>
                {#each $findPictureSources as value (value.id)}
                    <tr>
                        <td>{value.id}</td>
                        <td>{value.imgTitle}</td>
                        <td>{value.imgDescription}</td>
                        <td>{value.imgAlt}</td>
                        <td><img src={value.imgSrc} alt={value.imgAlt} width="200px" /></td>
                        <td><input type="checkbox" bind:checked={value.visible} /></td>
                        <td>{value.categoryId}</td>
                        <td>
                            <button onclick={() => deleteAssignment(value.id)}>Smazat</button>
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
