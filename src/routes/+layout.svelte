<script lang="ts">
	import '../app.css';
	import '../global.css';
	import { onMount } from 'svelte';
	import Sidebar from '$components/Sidebar.svelte';
	import { isAuthenticated, user } from '../stores/auth';

	export let data;

	let auth = false;

	onMount(() => {
		if (data.user) {
			user.set(data.user);
			isAuthenticated.set(true);
			console.log('User data:', data.user);
		}
	});

	let userData = { userName: '', email: '', role: '' };

	isAuthenticated.subscribe((a) => (auth = a));
	user.subscribe((u) => (userData = u));

	let sidebarOpen = false;

	function handleToggle(event: any) {
		console.log('Sidebar toggle event:', event.detail);
		sidebarOpen = event.detail;
	}

	function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="mobile-header">
  <button class="hamburger" on:click={toggleSidebar}>☰</button>
</div>


<div class="layout">
	<aside class="sidebar-container {sidebarOpen ? '' : 'closed'}">
		<Sidebar/>
	</aside>

	<main class="content">
		<slot />
<!--
		<footer>
			<div class="footer">
				<p>© 2025 Vytvořeno v rámci bakalářské práce Terezou Knápkovou.</p>
			</div>
		</footer>
-->
	</main>
</div>

<style>
	  .mobile-header {
    display: none;
  }
	.footer {
		background-color: #e9e9e9;
		color: var(--text-color);
		text-align: center;
		font-style: italic;
		margin-top: 1rem;
		font-size: small;
		color: gray;
		padding: 10px;
		/* position: fixed; */
		bottom: 0;
		width: 100%;
	}

	.layout {
		display: flex;
		height: 100vh;
		overflow: hidden;
		background-color: var(--background-color);
	}

	.sidebar-container {
		background: var(--background-color);
		padding: 10px;
		width: 150px;
		height: 100%;
		transition:
			width 0.3s ease,
			padding 0.3s ease;
		overflow-y: auto; /* If sidebar content becomes taller, it can scroll */
	}

	.content {
		margin: 0;
		width: 100%;
		flex: 1;
		overflow-y: auto; /* enable scroll on desktop */
	}

	@media screen and (max-width: 768px) {
    .layout {
      display: flex;
      flex-direction: column;
      /* enable overflow to allow scrolling */
      overflow: visible;
    }

    .mobile-header {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3rem;
      background: var(--background-color);
      z-index: 1001;
      padding: 0.5rem;
    }

    .hamburger {
      font-size: 1.5rem;
      background: none;
      border: none;
    }


   .sidebar-container {
      position: fixed;
      top: 0;
      right: 0;
      left: auto;
      width: 150px;       /* same width you had on desktop */
      height: auto;
      background: var(--background-color);
      padding: 10px;
      z-index: 1000;
    }

   .content {
     width: 100%;
     margin-top: 3rem; /* push below mobile header */
     overflow-y: auto;
     max-height: calc(100vh - 3rem);
   }
  }
  
</style>


