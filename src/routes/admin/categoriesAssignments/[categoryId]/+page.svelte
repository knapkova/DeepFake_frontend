<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { page } from '$app/state';
    import type { CategoryAssignment } from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import '../../../../styles/admin.css';

    const categoryId = page.params.categoryId;

    const api_get = `/api/Admin/CategoryAssignments/GetByCategoryId/${categoryId}`;
    const api_delete = `/api/Admin/CategoryAssignments/Delete/`;

    const assignmentTypeLabels: Record<number, string> = {
        1: 'Správný titulek',
        2: 'Manipulativní text',
        3: 'Úvodní článek',
        4: 'Najdi zdroj obrázku',
        5: 'Zobrazit výsledky',
        6: 'Výsledky po úkolu',
        7: 'Závěrečné výsledky'
    };

    let updateMessage = '';
    let fetchError = '';
    let loading = true;

    let assignments = writable<CategoryAssignment[]>([]);

    onMount(async () => {
        try {
            const response = await fetch(PUBLIC_VITE_API_ROOT + api_get, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error(`Server vrátil ${response.status}`);
            const data = await response.json();
            assignments.set(data);
        } catch {
            fetchError = 'Nepodařilo se načíst přiřazení. Zkuste stránku obnovit.';
        } finally {
            loading = false;
        }
    });

    async function deleteAssignment(id: number) {
        if (!confirm('Opravdu chcete smazat toto přiřazení?')) return;

        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_delete}${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            assignments.update(items => items.filter(a => a.id !== id));
            updateMessage = `Přiřazení ${id} smazáno.`;
        } else {
            updateMessage = `Nepodařilo se smazat přiřazení ${id}.`;
        }
    }
</script>

<a href="/admin" class="back-link">Zpět na přehled</a>
<h2>Přiřazení pro kategorii {categoryId}</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

{#if loading}
    <p class="status-message">Načítání...</p>
{:else if fetchError}
    <p class="status-message error" role="alert">{fetchError}</p>
{:else}
    <a href="/admin/categoriesAssignments/addNew" class="back-link">+ Přidat nové</a>
    <div class="admin-section">
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Pořadí</th>
                    <th>Typ úkolu</th>
                    <th>Id úkolu</th>
                    <th>Akce</th>
                </tr>
            </thead>
            <tbody>
                {#each $assignments as a (a.id)}
                    <tr>
                        <td>{a.id}</td>
                        <td>{a.orderIndex}</td>
                        <td>{assignmentTypeLabels[a.assignmentType] ?? a.assignmentType}</td>
                        <td>{a.assignmentId}</td>
                        <td>
                            <button onclick={() => deleteAssignment(a.id)}>Smazat</button>
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
