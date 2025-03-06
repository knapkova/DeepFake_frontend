<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type {AssignmentManipulativeText, ManipulativePart} from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    
    
    function navigate(){
    window.location.href = "/admin/introductionArticle/addNew";
}



</script>

<a href="/admin" class="back-link">Zpět na přehled</a>

<h2>Úkol: Manipulativní texty</h2>

<button onclick={navigate}>+ Přidat nové</button>
