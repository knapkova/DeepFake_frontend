<script>
import { onMount } from 'svelte';

onMount(() => {
    // This will help us debug where Vite is looking for assets
    console.log(import.meta.env.BASE_URL);
});
</script>

<div class="font-test">
    This text should use the YoureGone font
</div>

<style>
    .font-test {
        font-family: 'YoureGone', sans-serif;
    }
</style>