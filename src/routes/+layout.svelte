<script lang="ts">
	import '../app.css';
	import '../global.css';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import Sidebar from '$components/Sidebar.svelte';
	import { isAuthenticated, user } from '../stores/auth';

	// Vercel Web Analytics (page views). Development mode only logs to the console.
	injectAnalytics({ mode: dev ? 'development' : 'production' });

	export let data;

	onMount(() => {
		if (data.user) {
			user.set(data.user);
			isAuthenticated.set(true);
		}
	});

	let sidebarOpen = false;

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	// On phones the menu is a drawer over the page: close it once the user has navigated.
	afterNavigate(() => {
		if (window.matchMedia('(max-width: 768px)').matches) sidebarOpen = false;
	});
</script>

<div class="mobile-header">
	<button
		class="hamburger"
		on:click={toggleSidebar}
		aria-label={sidebarOpen ? 'Zavřít menu' : 'Otevřít menu'}
		aria-expanded={sidebarOpen}>☰</button
	>
</div>

{#if sidebarOpen}
	<button class="mobile-backdrop" aria-label="Zavřít menu" on:click={() => (sidebarOpen = false)}
	></button>
{/if}

<div class="layout">
	<aside class="sidebar-container">
		<Sidebar bind:sidebarOpen />
	</aside>

	<main class="content">
		<slot />
		<footer>
			<p>© 2025 Vytvořeno v rámci bakalářské práce Terezou Knápkovou.</p>
		</footer>
	</main>
</div>

<style>
	.mobile-header,
	.mobile-backdrop {
		display: none;
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
		width: 100%;
		flex: 1;
		overflow-y: auto; /* enable scroll on desktop */
	}

	footer {
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--my-gray);
		text-align: center;
		font-size: 0.8rem;
		color: var(--my-gray);
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


    /* The Sidebar positions itself as a fixed drawer on phones; the wrapper takes no space. */
    .sidebar-container {
      display: contents;
    }

    .mobile-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      border: none;
      z-index: 999;
    }

   .content {
     width: 100%;
     margin-top: 3rem; /* push below mobile header */
     overflow-y: auto;
     max-height: calc(100vh - 3rem);
	 padding: 5px;
   }
  }
  
</style>


