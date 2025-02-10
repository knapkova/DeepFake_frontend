<script lang="ts">
    import { onMount } from 'svelte';
    import '../../../styles/admin.css'

    interface Category {
        id: number;
        name: string;
        description: string;
        visible: boolean;
        duration: number;
        coverPhoto: string;
    }

    interface Headline {
        id: number;
        headline: string;
        content: string;
        visible: boolean;
        categoryId: number;
        category?: Category;
    }

    let headlines: Headline[] = [];
    let categories: Category[] = [];
    let updateMessage: string = '';

    onMount(async () => {
        try {
            const apiRoot = import.meta.env.VITE_API_ROOT;

            // Fetch headlines
            let response = await fetch(`${apiRoot}/api/Admin/AssignmentCorrectHeadline/GetAssignmentCorrectHeadlinesGetContr`);
            if (response.ok) {
                headlines = await response.json();
            } else {
                console.error('Failed to fetch headlines:', response.statusText);
            }

            // Fetch categories
            response = await fetch(`${apiRoot}/api/Admin/Categories/GetCategories`);
            if (response.ok) {
                categories = await response.json();
            } else {
                console.error('Failed to fetch categories:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    async function updateHeadline(headline: Headline) {
        try {
            const apiRoot = import.meta.env.VITE_API_ROOT;
            const response = await fetch(`${apiRoot}/api/Admin/AssignmentCorrectHeadline/Update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(headline)
            });
            if (response.ok) {
                updateMessage = 'Headline updated successfully!';
            } else {
                console.error('Failed to update headline:', response.statusText);
                updateMessage = 'Failed to update headline.';
            }
        } catch (error) {
            console.error('Error updating headline:', error);
            updateMessage = 'Error updating headline.';
        }
    }

    function editHeadline(id: number, field: keyof Headline, value: any) {
        const headline = headlines.find(headline => headline.id === id);
        if (headline) {
            (headline[field] as any) = value;
            updateHeadline(headline);
        }
    }

    function deleteHeadline(id: number) {
        headlines = headlines.filter(headline => headline.id !== id);
    }
</script>

<h1>Úprava titulků</h1>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

<div class="admin-section">
   <!--- <button on:click={addHeadline}>Přidat titulek</button> -->
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Titulek</th>
                <th>Obsah</th>
                <th>Viditelnost</th>
                <th>Kategorie</th>
                <th>Akce</th>
            </tr>
        </thead>
        <tbody>
            {#each headlines as headline}
                <tr>
                    <td>{headline.id}</td>
                    <td>
                        <textarea value={headline.headline} on:input={(e) => { 
                            const target = e.target as HTMLTextAreaElement;
                            editHeadline(headline.id, 'headline', target.value); 
                        }}></textarea>
                    </td>
                    <td>
                        <textarea value={headline.content} on:input={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            editHeadline(headline.id, 'content', target.value);
                        }}></textarea>
                    </td>
                    <td>
                        <input type="checkbox" checked={headline.visible} on:change={(e) => {
                            const target = e.target as HTMLInputElement;
                            editHeadline(headline.id, 'visible', target.checked);
                        }} />
                    </td>
                    <td>
                        <select value={headline.categoryId} on:change={(e) => {
                            const target = e.target as HTMLSelectElement;
                            editHeadline(headline.id, 'categoryId', parseInt(target.value, 10));
                        }}>
                            {#each categories as category}
                                <option value={category.id}>{category.name}</option>
                            {/each}
                        </select>
                    </td>
                    <td>
                        <button on:click={() => deleteHeadline(headline.id)}>Smazat</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
