<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type { AssignmentIntroductionArticle } from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import '../../../styles/admin_tables.css';

    const api_get = "/api/Admin/AssignmentIntroductionArticle/GetAssignmentIntroductionArticles";
    const api_delete = "/api/Admin/AssignmentIntroductionArticle/Delete";

    let updateMessage: string = '';
    let fetchError: string = '';
    let loading = true;

    let introductionArticles = writable<AssignmentIntroductionArticle[]>([]);

    onMount(async () => {
        try {
            const response = await fetch(PUBLIC_VITE_API_ROOT + api_get, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error(`Server vrátil ${response.status}`);
            const data = await response.json();
            introductionArticles.set(data);
        } catch {
            fetchError = 'Nepodařilo se načíst články. Zkuste stránku obnovit.';
        } finally {
            loading = false;
        }
    });

    async function deleteText(id: number) {
        if (!confirm('Opravdu chcete smazat tento článek?')) return;

        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_delete}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            introductionArticles.update(texts => texts.filter(text => text.id !== id));
            updateMessage = `Článek ${id} smazán.`;
        } else {
            updateMessage = `Nepodařilo se smazat článek ${id}.`;
        }
    }
</script>

<a href="/admin" class="back-link">Zpět na přehled</a>
<h2>Úkol: Úvodní články</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

{#if loading}
    <p class="status-message">Načítání...</p>
{:else if fetchError}
    <p class="status-message error" role="alert">{fetchError}</p>
{:else}
    <button onclick={() => window.location.href = '/admin/introductionArticle/addNew'}>+ Přidat nové</button>
    <table>
        <thead>
            <tr>
                <th>Nadpis</th>
                <th>Text</th>
                <th>Fotografie</th>
                <th>Viditelné</th>
                <th>Kategorie</th>
                <th>Akce</th>
            </tr>
        </thead>
        <tbody>
            {#each $introductionArticles as art (art.id)}
                <tr>
                    <td>{art.title}</td>
                    <td>{art.content}</td>
                    <td><a href={art.imgSrc}>Obrázek</a></td>
                    <td><input type="checkbox" bind:checked={art.visible} /></td>
                    <td>{art.categoryId}</td>
                    <td>
                        <a href="/admin/introductionArticle/edit/{art.id}">Upravit</a>
                        <button onclick={() => deleteText(art.id)}>Smazat</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}

<style>
    .status-message { padding: 1rem; }
    .status-message.error { color: #dc2626; }
</style>
