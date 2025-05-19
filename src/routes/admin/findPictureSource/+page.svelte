<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import '../../../styles/admin.css';
    import type { AssignmentFindPictureSource } from '$types/interfaces';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

let updateMessage: string = '';

let request_get = '/api/Admin/AssignmentFindPictureSource/GetAssignmentFindPictureSources';
let request_update = '/api/Admin/AssignmentFindPictureSource/Update/';
let request_delete = '/api/Admin/AssignmentFindPictureSource/Delete/';

function navigate(){
    window.location.href = "/admin/findPictureSource/addNew";
}

let findPictureSources = writable<AssignmentFindPictureSource[]>([]);
    onMount(async () => {
        const response = await fetch(PUBLIC_VITE_API_ROOT + request_get); 
        const data = await response.json();
        findPictureSources.set(data);
        console.log(data);


    });


async function deleteAssignment(id:number){
    const response = await fetch(`${PUBLIC_VITE_API_ROOT}${request_delete}${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        findPictureSources.update(texts => texts.filter(text => text.id !== id));
    } else {
        console.error('Failed to delete text');
    }
}


</script>
<a href="/admin" class="back-link">Zpět na přehled</a>


<h2>Najdi zdroj k obrázku</h2>
{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

<button onclick={navigate}>+ Přidat nové</button>

<div class = "admin-section">
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
            {#each $findPictureSources as value}
            <tr>
                <td>{value.id}</td>
                <td>{value.imgTitle}</td>
                <td>{value.imgDescription}</td>
                <td>{value.imgAlt}</td>
                
                <td><img src={value.imgSrc} alt={value.imgAlt} width="200px" /></td>
                <td>
                    <input
                      type="checkbox"
                      bind:checked={value.visible}
                    />
                </td>
                <td>{value.categoryId}</td>
                <td>
                    <button onclick={() => deleteAssignment(value.id)}>Smazat</button>
            </tr>
            {/each}   
        </tbody>
    </table>
</div>