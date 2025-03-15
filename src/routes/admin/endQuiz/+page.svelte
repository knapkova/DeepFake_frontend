<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import '../../../styles/admin.css';
    import type {  } from '$types/interfaces';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    function navigate(){
    window.location.href = "/admin/endQuiz/addNew";
}

let updateMessage: string = '';
</script>
<a href="/admin" class="back-link">Zpět na přehled</a>
<h2>Opakovací kvíz</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

<button onclick={navigate}>+ Přidat nové</button>
