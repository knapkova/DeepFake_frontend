<script>
	import fbLogo from '../assets/fb_logo.png';
	import igLogo from '../assets/ig_logo.png';
	import zvolsiinfoSidebar from '../assets/zvolsiingo_redLogo.png';
	import { goto } from '$app/navigation';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import { fade } from 'svelte/transition';

	import { isAuthenticated, user } from '$stores/auth';

	export let sidebarOpen = false;

	let auth = false;
	let userData = {
		userName: '',
		email: '',
		role: ''
	};
	isAuthenticated.subscribe((a) => (auth = a));
	user.subscribe((u) => (userData = u));

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
	async function logout() {
		isAuthenticated.set(false);
		try {
			const response = await fetch(`${PUBLIC_VITE_API_ROOT}/api/Security/Account/Logout`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include'
			});
			console.log('Logout response:', response);
		} catch (error) {
			console.error('Logout error:', error);
		}

		user.set({ userName: '', email: '', role: '' });
		goto('/account/login');
	}
</script>

<div class="sidebar {sidebarOpen ? 'open' : ''}">
	<div class="logo"><img src={zvolsiinfoSidebar} alt="Zvolsiinfo" /></div>
	<div class="menu">
		<button class="hamburger" on:click={toggleSidebar} aria-label="Toggle sidebar">☰</button>
		{#if sidebarOpen}
			{#if auth}
				<header class="sidebar-header" in:fade={{ delay: 300, duration: 400 }}>
					<div class="user-info">
						<span class="user-icon">👤</span>
						<div class="user-details">
							<span class="user-name">{$user.userName}</span>
							<span class="user-role">{$user.role}</span>
						</div>
					</div>
					<button class="logout-btn" on:click={logout}>🚪↩️</button>
				</header>
			{:else}
				<!--
					<header class="sidebar-header" in:fade={{ delay: 300, duration: 400 }}>
					<a href="/account/login" class="menu-link button">Login</a>
					</header> 
					-->
			{/if}

			<nav class="menu-options" in:fade={{ delay: 300, duration: 400 }}>
				<a href="/" class="menu-link">
					<span class="text">Hlavní stránka</span>
				</a>

				<a href="/about" class="menu-link">
					<span class="text">O nás</span>
				</a>
				<a href="/contact" class="menu-link">O zvolSi.info</a>

				{#if auth}
					<div class="auth-links">
						<a href="/admin" class="menu-link">Admin</a>
					</div>
				{:else}
					<!--
					<div class="auth-links">
						<a href="/account/register" class="menu-link button">Registr</a>
					</div>
					-->
				{/if}
			</nav>
		{/if}
	</div>

	<div class="social-icons">
		<a href="https://www.facebook.com/zvolsiinfo" target="_blank" rel="noopener noreferrer">
			<img src={fbLogo} alt="Facebook" />
		</a>
		<a href="https://www.instagram.com/zvol_si_info/" target="_blank" rel="noopener noreferrer">
			<img src={igLogo} alt="Instagram" />
		</a>
	</div>
</div>

<style>
	/* Sidebar container */
	.sidebar {
		width: 55%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		height: 100%;
		color: var(--background-color);
		border-right: 0.5px solid rgba(0, 0, 0, 0.358);
		transition: width 0.3s ease;
	}
	.sidebar.open {
		width: 120px;
	}

	/* Logo */
	.logo {
		width: 100%;
		text-align: center;
	}
	.logo img {
		width: 80%;
	}

	/* Hamburger button */
	button.hamburger {
		font-size: 30px !important;
		color: var(--my-gray) !important;
		background: transparent !important;
		border: none !important;
		cursor: pointer !important;
	}

	/* Shared flex‑column + gap */
	.menu,
	.menu-options,
	.auth-links,
	.social-icons {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		align-items: center;
	}

	/* Menu */
	.menu {
		align-items: center;
	}

	/* Menu options (hidden until open) */
	.menu-options {
		margin-top: 20px;
		display: none;
	}
	.sidebar.open .menu-options {
		display: flex;
	}

	/* Links styling */
	.menu-link {
		text-decoration: none;
		color: #333;
		font-size: 0.75rem;
		padding: 10px;
		border-radius: 6px;
		text-align: center;
		transition:
			background 0.3s ease,
			transform 0.3s ease;
	}
	.menu-link:hover {
		background: #f0f0f0;
	}

	/* Primary button variant */
	.button {
		background: #2575fc;
		color: #fff !important;
		transition: background 0.3s ease;
	}
	.button:hover {
		background: #1a5acb;
	}

	/* Auth links */
	.auth-links {
		margin-top: 20px;
	}

	/* Social icons */
	.social-icons img {
		width: 24px;
		height: 24px;
	}

	/* Sidebar header */
	.sidebar-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 15px;
		padding: 10px 15px;
		background: linear-gradient(135deg, #ff020279, #b8bcc2);
		color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		font-family: sans-serif;
	}

	/* User info inside header */
	.user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		margin-bottom: 10px;
	}
	.user-icon {
		font-size: 1rem;
	}
	.user-details {
		text-align: center;
	}
	.user-name {
		font-weight: bold;
	}
	.user-role {
		font-size: 0.55rem;
		opacity: 0.8;
	}

	/* Logout button */
	.logout-btn {
		width: 100%;
		padding: 6px 12px;
		background: #ff4b2b69;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.3s ease;
	}
	.logout-btn:hover {
		background: #d5d3d3cb;
	}
	@media screen and (max-width: 768px) {
		/* Hide the wrapper so only this fixed sidebar shows */
		.sidebar-container {
			display: none !important;
		}

		/* Base sidebar: off-canvas to the right when closed */
		.sidebar {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: auto;
			width: 240px; /* or whatever width you prefer */
			max-width: 80vw;
			background: var(--background-color);
			box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
			transform: translateX(100%);
			transition: transform 0.3s ease;
			z-index: 1000;
		}
		/* Slide into view when “open” */
		.sidebar.open {
			transform: translateX(0);
		}

		/* Always-visible hamburger trigger */
		button.hamburger {
			position: fixed;
			top: 16px;
			right: 16px;
			font-size: 24px;
			background: transparent;
			border: none;
			z-index: 1001;
		}

		/* Make sure your header & menu have a solid bg */
		.sidebar-header,
		.menu-options {
			background: var(--background-color);
		}

		/* Stack menuItems in the drawer */
		.menu-options {
			display: flex !important;
			flex-direction: column;
			padding: 70px 16px 16px; /* leave room for hamburger */
			gap: 12px;
		}

		/* Hide the tiny social row down here */
		.social-icons {
			display: none;
		}

		/* Scale your logo down a bit */
		.logo img {
			width: 60%;
		}
	}
</style>
