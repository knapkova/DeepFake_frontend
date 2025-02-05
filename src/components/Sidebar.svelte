<script>
    import fbLogo from '../assets/fb_logo.png';
    import igLogo from '../assets/ig_logo.png';
    import zvolsiinfoSidebar from '../assets/zvolsiingo_redLogo.png'
    import "../global.css";
</script>

<div class="sidebar">
    <div class="logo"><img src={zvolsiinfoSidebar} alt="Zvolsiinfo" /></div>
    <div class="menu">
        <span class="hamburger">☰</span>
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
        color: var(--background-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        height: 90%;
        border-right: 0.5px solid rgba(0, 0, 0, 0.358);
    }
    .logo{
        align-items: center;
    }

    .logo img {
        width: 80%;
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
        cursor: pointer;
        color: var(--my-gray);
        font-size: 30px;

    }
</style>