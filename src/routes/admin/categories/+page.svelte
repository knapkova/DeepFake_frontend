<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import '../../../styles/admin.css';
    import type { Category } from '$types/interfaces';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

    function navigate(){
    window.location.href = "/admin/categories/addNew";
    }

    let updateMessage: string = '';
    let request_get = '/api/Admin/Categories/GetCategories';
    let request_update = '/api/Admin/AssignmentFindPictureSource/Update';
    let request_delete = '/api/Admin/Categories/Delete/{id}';


    let categories = writable<Category[]>([]);
    onMount(async () => {
        const response = await fetch(PUBLIC_VITE_API_ROOT + request_get); 
        const data = await response.json();
        categories.set(data);
        console.log(data);
    });

    async function deleteAssignment(id:number){
    const response = await fetch(`${PUBLIC_VITE_API_ROOT}${request_delete}/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        categories.update(texts => texts.filter(text => text.id !== id));
    } else {
        console.error('Failed to delete text');
    }
}



</script>

<h2>Úprava kategorií</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

<button onclick={navigate}>+ Přidat nové</button>
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
            {#each $categories as category}
                <tr>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>{category.duration}</td>
                    <td><input type="checkbox" checked={category.visible} disabled /></td>
                    <td>{category.ImgSrc}</td>
                    <td>
                        <a href="/admin/categories/edit/{category.id}">Upravit</a>
                        <a href="/admin/categories/delete/{category.id}">Smazat</a>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

