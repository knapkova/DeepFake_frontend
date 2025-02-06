<script lang="ts">
    import { onMount } from 'svelte';
    //import '../../global.css';

    interface Category {
        id: number;
        name: string;
        description: string;
        visible: boolean;
        duration: number;
        coverPhoto: string;
    }

    let categories: Category[] = [];

    onMount(async () => {
        try {
            const apiRoot = import.meta.env.VITE_API_ROOT;
            const response = await fetch(`${apiRoot}/api/Admin/Categories/GetCategories`);
            if (response.ok) {
                categories = await response.json();
            } else {
                console.error('Failed to fetch categories:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    });

    async function addCategory(){}

    async function updateCategory(category: Category) {
        try {
            const apiRoot = import.meta.env.VITE_API_ROOT;
            const response = await fetch(`${apiRoot}/api/Admin/Categories/Update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(category)
            });
            if (!response.ok) {
                console.error('Failed to update category:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    }

    function editCategory(id: number, field: keyof Category, value: any) {
        const category = categories.find(category => category.id === id);
        if (category) {
            (category[field] as any) = value;
            updateCategory(category);
        }
        
    }

    function deleteCategory(id: number) {
        categories = categories.filter(category => category.id !== id);
    }
</script>

<h1>Úprava kategorií</h1>

<div class="admin-section">
    <!-- <button on:click={addCategory}>Přidat kategorii</button> -->
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Název</th>
                <th>Popis</th>
                <th>Viditelnost</th>
                <th>Délka</th>
                <th>Obrázek</th>
                <th>Akce</th>
            </tr>
        </thead>
        <tbody>
            {#each categories as category}
            <tr>
                <td>{category.id}</td>
                <td>
                    <input type="text" value={category.name} on:input={(e) => { 
                        const target = e.target as HTMLInputElement;
                        editCategory(category.id, 'name', target.value); 
                    }} />
                </td>
                <td>
                    <input type="text" value={category.description} on:input={(e) => {
                        const target = e.target as HTMLInputElement;
                        editCategory(category.id, 'description', target.value);
                    }} />
                </td>
                <td>
                    <input type="checkbox" checked={category.visible} on:change={(e) => {
                        const target = e.target as HTMLInputElement;
                        editCategory(category.id, 'visible', target.checked);
                    }} />
                </td>
                <td>
                    <input type="number" value={category.duration} on:input={(e) => {
                        const target = e.target as HTMLInputElement;
                        editCategory(category.id, 'duration', parseInt(target.value, 10));
                    }} /> min
                </td>
                <td>
                    <input type="text" value={category.coverPhoto} on:input={(e) => {
                        const target = e.target as HTMLInputElement;
                        editCategory(category.id, 'coverPhoto', target.value);
                    }} />
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>

<style>
    .admin-section {
        margin-top: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }

    input[type="text"], input[type="number"] {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }

    button {
        margin-right: 5px;
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }

    img {
        border-radius: 5px;
    }
</style>