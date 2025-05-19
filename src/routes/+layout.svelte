<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
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
</script>

<div class="layout">
	<aside class="sidebar-container {sidebarOpen ? '' : 'closed'}">
		<Sidebar on:toggle={handleToggle} {sidebarOpen} />
	</aside>

	<main class="content">
		<slot />

		<footer>
			<div class="footer">
				<p>© 2025 Vytvořeno v rámci bakalářské práce Terezou Knápkovou.</p>
			</div>
		</footer>
	</main>
</div>

<style>
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
		flex: 1;
		overflow-y: auto; /* Allow main content to scroll if it exceeds viewport height */
	}

	@media screen and (max-width: 768px) {
    .layout {
      display: flex;
      flex-direction: row-reverse;

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

    /* push the page content down so it’s not hidden under the top-bar */
    .content {
      width: 100%;
    }
  }
</style>
