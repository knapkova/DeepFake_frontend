<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type {AssignmentIntroductionArticle} from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import '../../../styles/admin_tables.css';

    const api_get = "/api/Admin/AssignmentIntroductionArticle/GetAssignmentIntroductionArticles";
    const api_delete = "/api/Admin/AssignmentIntroductionArticle/Delete";
    const api_update = "/api/Admin/AssignmentIntroductionArticle/Update";
    
    
    function navigate(){
    window.location.href = "/admin/introductionArticle/addNew";
}

let introductionArticles = writable<AssignmentIntroductionArticle[]>([]);
    onMount(async () => {
        const response = await fetch(PUBLIC_VITE_API_ROOT + api_get); 
        const data = await response.json();
        introductionArticles.set(data);
    });

async function deleteText(id: number) {
    const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_delete}/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        introductionArticles.update(texts => texts.filter(text => text.id !== id));
    } else {
        console.error('Failed to delete text');
    }
}

</script>

<a href="/admin" class="back-link">Zpět na přehled</a>

<h2>Úkol: Úvodní věc</h2>

<button onclick={navigate}>+ Přidat nové</button>
<table>
    <thead>
        <tr>
            <th>Nadpis</th>
            <th>Text</th>
            <th>Fotografie</th>
            <th>Viditelné</th>
            <th>Kategorie</th>
            <th>Akce</th>

        </tr>
    </thead>

    <tbody>
        {#each $introductionArticles as art}
            <tr>
                <td>{art.title}</td>
                <td>{art.content}</td>
                <td><a href={art.imgSrc}>Obrázek</a></td>
                <td>
                    <input
                      type="checkbox"
                      bind:checked={art.visible}
                    />
                </td>
                <td>{art.categoryId}</td>
                <td>
                    <a href="/admin/introductionArticle/edit/{art.id}" target="_blank">Upravit</a>
                    <button onclick={() => deleteText(art.id)}>Smazat</button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>