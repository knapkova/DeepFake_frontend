<script>
    import { onMount } from "svelte";
    import Sidebar from "../components/Sidebar.svelte";
</script>

<div class="layout">
    <aside class="sidebar-container">
        <Sidebar />
    </aside>

    <main class="content">
        <slot />
    </main>
</div>

<style>
    .layout {
        display: flex;
        height: 100vh;
    }
    .sidebar-container {
        background: var(--background-color);
        padding: 10px;
        height:100%;
    }
    
    
    .content {
        flex: 1;
        padding: 20px;
    }

</style>