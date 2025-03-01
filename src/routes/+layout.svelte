<script>
    import Sidebar from "../components/Sidebar.svelte";
    let sidebarOpen = true;
  
    // This handler will update the state when the sidebar is toggled.
    function handleToggle(event) {
      sidebarOpen = event.detail;
    }
  </script>
  
  <div class="layout">
    <!-- Add a class based on the sidebar state -->
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
    }
    .sidebar-container {
      background: var(--background-color);
      padding: 10px;
      height: 100%;
      transition: width 0.3s ease, padding 0.3s ease;
      width: 150px; /* width when open */
    }
    /* When closed, collapse the container */
    .sidebar-container.closed {
      width: 0;
      padding: 0;
      overflow: hidden;
    }
    .content {
      flex: 1;
      padding: 20px;
    }
  </style>
  