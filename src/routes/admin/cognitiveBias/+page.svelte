<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type { Category, AssignmentCognitiveBias } from '$types/interfaces';
    import '../../../styles/admin.css';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import type { PageData } from './$types';

    

    function navigate() {
        window.location.href = "/admin/cognitiveBias/addNew";
    }

    let updateMessage: string = '';
    const request_get = "/api/Admin/AssignmentCognitiveBias/GetAssignmentCognitiveBiases";
    const request_get_categories = '/api/Admin/Categories/GetCategories';
    const request_delete = "/api/Admin/AssignmentCognitiveBias/Delete";
    const request_update = "/api/Admin/AssignmentCognitiveBias/Update";

    let categories = writable<Category[]>([]);
    let cognitiveBiases = writable<AssignmentCognitiveBias[]>([]);
    // Track loading state per cognitive bias (keyed by its id)
    let loadingUpdate: Record<number, boolean> = {};
    let loadingDelete: Record<number, boolean> = {};

    onMount(async () => {
        let response_cat = await fetch(PUBLIC_VITE_API_ROOT + request_get_categories);
        let data_cat = await response_cat.json();
        categories.set(data_cat);

        const response = await fetch(PUBLIC_VITE_API_ROOT + request_get);
        const data = await response.json();
        console.log(data);
        cognitiveBiases.set(data);
    });

    async function updateCognitive(cognitiveBias: AssignmentCognitiveBias) {
        loadingUpdate[cognitiveBias.id] = true;
        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${request_update}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(cognitiveBias)
        });

        console.log(response);
        if (response.ok) {
            updateMessage = `Úkol ${cognitiveBias.id} úspěšně upraven!`;
        } else {
            updateMessage = `Nepodařilo se upravit: ${cognitiveBias.id}.`;
            console.error('Update failed', response);
        }
        loadingUpdate[cognitiveBias.id] = false;
    }

    async function deleteCognitive(id: number) {
        loadingDelete[id] = true;
        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${request_delete}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            cognitiveBiases.update(biases => biases.filter(b => b.id !== id));
            updateMessage = `Úkol ${id} úspěšně smazán.`;
        } else {
            updateMessage = `Nepodařilo se smazat úkol: ${id}.`;
            console.error('Failed to delete cognitive bias', response);
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