<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {PUBLIC_VITE_API_ROOT} from "$env/static/public";
  import Sidebar from "../components/Sidebar.svelte";
  import { isAuthenticated, user } from "../stores/auth";
  export let data;

  let auth = false;

  onMount(() => {
    if (data.user) {
      user.set(data.user);
      isAuthenticated.set(true);
      console.log("User data:", data.user);
    }
  });

  let userData = {
    userName: '',
    email:'',
     role:'',
  };
  isAuthenticated.subscribe(a => auth = a)
  user.subscribe(u => userData = u)
  
  let sidebarOpen = true;


  function handleToggle(event: any) {
    console.log("Sidebar toggle event:", event.detail);
    sidebarOpen = event.detail;
  }

</script>


<div class="layout">
  <aside class="sidebar-container {sidebarOpen ? '' : 'closed'}">
    <Sidebar on:toggle={handleToggle} {sidebarOpen}/>
    
  </aside>
 
  <main class="content">
    <slot />
  </main>
</div>

<style>
  .layout {
    display: flex;
    height: 100vh;         
    overflow: hidden;      
  }

  .sidebar-container {
    background: var(--background-color);
    padding: 10px;
    width: 150px;          
    height: 100%;         
    transition: width 0.3s ease, padding 0.3s ease;
    overflow-y: auto;      /* If sidebar content becomes taller, it can scroll */

  }

  .sidebar-container.closed {
    width: 0;
    padding: 0;
    overflow: hidden;      /* Hide content */
  }

  .content {
    flex: 1;             
    padding: 20px;
    overflow-y: auto;      /* Allow main content to scroll if it exceeds viewport height */
    

  }

  

</style>
