<script lang="ts">
    import { onMount } from 'svelte';
    import '../../../styles/admin.css'
    import type {AssignmentWrongObjectPicture,Category} from '$types/interfaces'

    let wrongObjectPictures: AssignmentWrongObjectPicture[] = [];
    let categories: Category[] = [];
    let updateMessage: string = '';

    onMount(async () => {
        try {
            const apiRoot = import.meta.env.VITE_API_ROOT;

            // Fetch wrong object pictures
            let response = await fetch(`${apiRoot}/api/Admin/AssignmentWrongObjectPicture/GetAssignmentWrongObjectPictures`);
            if (response.ok) {
                wrongObjectPictures = await response.json();
            } else {
                console.error('Failed to fetch wrong object pictures:', response.statusText);
            }
            
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

    function editWrongObjectPicture(){
        console.log('editWrongObjectPicture');
    }

    function deleteWrongObjectPicture(){
        console.log('deleteWrongObjectPicture');
    }
    

    
</script>

<h1>Úprava vyfotoshopovaných obrázku</h1>
<div class="admin-section">
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nadpis</th>
                <th>Komentář</th>
                <th>Alt</th>
                <th>Fotografie</th>
                <th>Kategorie</th>
                <th>Akce</th>
            </tr>
        </thead>
        <tbody>
            {#each wrongObjectPictures as wrongObjectPicture (wrongObjectPicture.id)}
                <tr>
                    <td>{wrongObjectPicture.id}</td>
                    <td contenteditable="true" on:blur={() => editWrongObjectPicture()}>{wrongObjectPicture.headline}</td>
                    <td contenteditable="true" on:blur={() => editWrongObjectPicture()}>{wrongObjectPicture.comment}</td>
                    <td contenteditable="true" on:blur={() => editWrongObjectPicture()}>{wrongObjectPicture.alt}</td>
                    <td contenteditable="true" on:blur={() => editWrongObjectPicture()}>{wrongObjectPicture.picture}</td>
                    <td contenteditable="true" on:blur={() => editWrongObjectPicture()}><select value={wrongObjectPicture.categoryId} on:change={(e) => {
                        const target = e.target as HTMLSelectElement;
                    }}>
                        {#each categories as category}
                            <option value={category.id}>{category.name}</option>
                        {/each}
                    </select></td>
                    <td>
                        <button on:click={() => deleteWrongObjectPicture()}>Smazat</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>