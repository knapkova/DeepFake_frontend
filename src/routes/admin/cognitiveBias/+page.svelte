<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type { Category, AssignmentCognitiveBias } from '$types/interfaces';
    import '../../../styles/admin.css';
    import { getCategories } from '$lib/db/categories';
    import * as db from '$lib/db/cognitiveBias';

    function navigate() {
        window.location.href = "/admin/cognitiveBias/addNew";
    }

    let updateMessage: string = '';

    let categories = writable<Category[]>([]);
    let cognitiveBiases = writable<AssignmentCognitiveBias[]>([]);

    // Track loading state per cognitive bias (keyed by its id)
    let loadingUpdate: Record<number, boolean> = {};
    let loadingDelete: Record<number, boolean> = {};

    onMount(async () => {
        categories.set(await getCategories());
        cognitiveBiases.set(await db.getCognitiveBiases());
    });

    async function updateCognitive(cognitiveBias: AssignmentCognitiveBias) {
        loadingUpdate[cognitiveBias.id] = true;
        try {
            await db.updateCognitiveBias(cognitiveBias);
            updateMessage = `Úkol ${cognitiveBias.id} úspěšně upraven!`;
        } catch (e) {
            updateMessage = `Nepodařilo se upravit: ${cognitiveBias.id}.`;
            console.error('Update failed', e);
        }
        loadingUpdate[cognitiveBias.id] = false;
    }

    async function deleteCognitive(id: number) {
        if (!confirm('Opravdu chcete smazat toto kognitivní zkreslení?')) return;
        loadingDelete[id] = true;
        try {
            await db.deleteCognitiveBias(id);
            cognitiveBiases.update(biases => biases.filter(b => b.id !== id));
            updateMessage = `Úkol ${id} úspěšně smazán.`;
        } catch (e) {
            updateMessage = `Nepodařilo se smazat úkol: ${id}.`;
            console.error('Failed to delete cognitive bias', e);
        }
        loadingDelete[id] = false;
    }
</script>

{#if updateMessage}
  <div class="update-message">{updateMessage}</div>
{/if}

<button onclick={navigate}>+ Přidat nové</button>

<div class="admin-section">
    <h2>Seznam kognitivních zkreslení</h2>
    <table class="admin-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Název</th>
                <th>Definice</th>
                <th>Příklad</th>
                <th>Zobrazit</th>
                <th>Kategorie</th>
                <th>Akce</th>
            </tr>
        </thead>
        <tbody>
            {#each $cognitiveBiases as biases (biases.id)}
            <tr>
                <td>{biases.id}</td>
                <td>
                    <input type="text" bind:value={biases.cognitiveBias} />
                </td>
                <td>
                    <input type="text" bind:value={biases.definition} />
                </td>
                <td>
                    <input type="text" bind:value={biases.example} />
                </td>
                <td>
                    <input type="checkbox" bind:checked={biases.visible} />
                </td>
                <td>
                    <select bind:value={biases.categoryId}>
                        {#each $categories as category}
                            <option value={category.id}>{category.name}</option>
                        {/each}
                    </select>
                </td>
                <td>
                    <button 
                        onclick={() => updateCognitive(biases)}
                        disabled={loadingUpdate[biases.id]}>
                        {#if loadingUpdate[biases.id]}
                            Updating...
                        {:else}
                            Uložit
                        {/if}
                    </button>
                    <button 
                        onclick={() => deleteCognitive(biases.id)}
                        disabled={loadingDelete[biases.id]}>
                        {#if loadingDelete[biases.id]}
                            Deleting...
                        {:else}
                            Smazat
                        {/if}
                    </button>
                </td>
            </tr>
            {/each}
        </tbody>
    </table>
</div>