<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import Sidebar from "$components/Sidebar.svelte"
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
</script>

<div class="layout">
	<aside class="sidebar-container {sidebarOpen ? '' : 'closed'}">
		<Sidebar on:toggle={handleToggle} {sidebarOpen} />
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
		flex: 1;
		overflow-y: auto; /* Allow main content to scroll if it exceeds viewport height */
	}

	 @media screen and (max-width: 768px) {
    /* hide sidebar on mobile */
    .sidebar-container {
      display: none;
    }
    /* let content take full width */
    .content {
      width: 100%;
    }
  }
</style>
