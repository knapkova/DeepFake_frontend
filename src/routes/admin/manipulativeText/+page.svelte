<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type {AssignmentManipulativeText, ManipulativePart} from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

    const api_get = "/api/Admin/AssignmentManipulativeText/GetAssignmentManipulativeTexts";
    const api_delete = "/api/Admin/AssignmentManipulativeText/Delete";
    const api_update = "/api/Admin/AssignmentManipulativeText/Update";
    
    
    
    function navigate(){
    window.location.href = "/admin/manipulativeText/addNew";
}

    let manipulativeTexts = writable<AssignmentManipulativeText[]>([]);
        onMount(async () => {
            const response = await fetch(PUBLIC_VITE_API_ROOT + api_get); // Adjust the API endpoint as needed
            const data = await response.json();
            data.forEach((item: AssignmentManipulativeText) => {
            item.manipulativeParts = JSON.parse(item.manipulativeParts as unknown as string);
        });
            manipulativeTexts.set(data);
            console.log(data);
        });

        async function deleteText(id: number) {
        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_delete}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            manipulativeTexts.update(texts => texts.filter(text => text.id !== id));
        } else {
            console.error('Failed to delete text');
        }
    }
    


</script>
<a href="/admin" class="back-link">Zpět na přehled</a>

<h2>Úkol: Manipulativní texty</h2>

<button onclick={navigate}>+ Přidat nové</button>

<table>
    <thead>
        <tr>
            <th>Nadpis</th>
            <th>Text</th>
            <th>Manipulativní části</th>
            <th>Akce</th>
        </tr>
    </thead>
    <tbody>
        {#each $manipulativeTexts as text}
            <tr>
                <td>{text.header}</td>
                <td>{text.text}</td>
                <td>
                    <ul>
                        {#each text.manipulativeParts as part}
                            <li>Start: {part.startIndex}, End: {part.endIndex}, Důvod: {part.reason}</li>
                        {/each}
                    </ul>
                </td>
                <td>
                    <button onclick={() => deleteText(text.id)}>Smazat</button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }

    button {
        padding: 5px 10px;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #c82333;
    }
</style>