<script>
    import fbLogo from '../assets/fb_logo.png';
    import igLogo from '../assets/ig_logo.png';
    import zvolsiinfoSidebar from '../assets/zvolsiingo_redLogo.png'
    import "../global.css";

    let sidebarOpen = false;

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }
</script>

<div class="sidebar {sidebarOpen ? 'open' : ''}">
    <div class="logo"><img src={zvolsiinfoSidebar} alt="Zvolsiinfo" /></div>
    <div class="menu">
        <button class="hamburger" on:click={toggleSidebar} aria-label="Toggle sidebar">☰</button>
        {#if sidebarOpen}
            <nav class="menu-options">
                <a href="/">Hlavní stránka</a>
                <a href="/about">Jak hrát</a>
                <a href="/contact">O zvolSi.info</a>
                <a href="/admin">Admin</a>
            </nav>
        {/if}
    </div>
    <div class="social-icons">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={fbLogo} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={igLogo} alt="Instagram" />
        </a>
    </div>
</div>

<style>
    .sidebar {
        width: 15%; 
        color: var(--background-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        height: 90%;
        border-right: 0.5px solid rgba(0, 0, 0, 0.358);
        transition: width 0.3s ease;

    }
    .logo{
        text-align: center;
        width: auto;
        width: 100%;
    }
    .sidebar.open {
        width: 150px;    }


    .logo img {
        width: 80%;
    }

    .menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .menu-options {
        display: none;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
        width: 100%;
    }

    .sidebar.open .menu-options {
        display: flex;
    }

    .menu-options a {
        color: black;
        text-decoration: none;
        font-size: 15px;
        padding: 5px;
        width: 100%;
        text-align: center;
    }

    .social-icons {
        display: flex;
        gap: 10px;
        flex-direction: column;
    }

    .social-icons img {
        width: 24px;
        height: 24px;
    }

    .hamburger {
        cursor: pointer !important;
        color: var(--my-gray) !important;
        font-size: 30px !important;
        background: transparent !important; 
        border: none !important; 
    }
</style>