<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type { AssignmentManipulativeText, ManipulativePart } from '$types/interfaces';
    import * as db from '$lib/db/manipulativeText';
    import '../../../styles/admin_tables.css';

    let updateMessage: string = '';
    let fetchError: string = '';
    let loading = true;

    let manipulativeTexts = writable<AssignmentManipulativeText[]>([]);

    onMount(async () => {
        try {
            manipulativeTexts.set(await db.getManipulativeTexts());
        } catch {
            fetchError = 'Nepodařilo se načíst texty. Zkuste stránku obnovit.';
        } finally {
            loading = false;
        }
    });

    async function deleteText(id: number) {
        if (!confirm('Opravdu chcete smazat tento text?')) return;
        try {
            await db.deleteManipulativeText(id);
            manipulativeTexts.update(texts => texts.filter(text => text.id !== id));
            updateMessage = `Text ${id} smazán.`;
        } catch (e) {
            console.error(e);
            updateMessage = `Nepodařilo se smazat text ${id}.`;
        }
    }
</script>

<a href="/admin" class="back-link">Zpět na přehled</a>
<h2>Úkol: Manipulativní texty</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

{#if loading}
    <p class="status-message">Načítání...</p>
{:else if fetchError}
    <p class="status-message error" role="alert">{fetchError}</p>
{:else}
    <button onclick={() => window.location.href = '/admin/manipulativeText/addNew'}>+ Přidat nové</button>
    <table>
        <thead>
            <tr>
                <th>Nadpis</th>
                <th>Text</th>
                <th>Manipulativní části</th>
                <th>Viditelné</th>
                <th>Kategorie</th>
                <th>Akce</th>
            </tr>
        </thead>
        <tbody>
            {#each $manipulativeTexts as text (text.id)}
                <tr>
                    <td>{text.header}</td>
                    <td>{text.text}</td>
                    <td>
                        <ul>
                            {#each (text.manipulativeParts as unknown as ManipulativePart[]) as part}
                                <li>Start: {part.startIndex}, End: {part.endIndex}, Důvod: {part.reason}</li>
                            {/each}
                        </ul>
                    </td>
                    <td><input type="checkbox" bind:checked={text.visible} /></td>
                    <td>{text.categoryId}</td>
                    <td>
                        <button onclick={() => deleteText(text.id)}>Smazat</button>
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
