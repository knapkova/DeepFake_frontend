<script>

    import fbLogo from '../assets/fb_logo.png';
    import igLogo from '../assets/ig_logo.png';
    import zvolsiinfoSidebar from '../assets/zvolsiingo_redLogo.png'
    import { goto } from "$app/navigation";
    import {PUBLIC_VITE_API_ROOT} from "$env/static/public";


    import "../global.css";
    import {isAuthenticated,user} from "../stores/auth";

    export let sidebarOpen = false;
    let auth = false;
    let userData = {
        userName: '',
        email:'',
        role:'',
    };
    isAuthenticated.subscribe(a => auth = a)
    user.subscribe(u => userData = u)
  

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }
    async function logout() {
    isAuthenticated.set(false);
    try {
      const response = await fetch(`${PUBLIC_VITE_API_ROOT}/api/Security/Account/Logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // Ensure cookies are sent
      });
      console.log("Logout response:", response);
    } catch (error) {
      console.error("Logout error:", error);
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
        <header class="sidebar-header">
            {#if auth}
              <div class="user-info">
                <span class="user-icon">👤</span>
                <div class="user-details">
                  <span class="user-name">{$user.userName}</span>
                  <span class="user-role">{$user.role}</span>
                </div>
              </div>
              <button class="logout-btn" on:click={logout}>🚪↩️</button>
            {:else}
              <a href="/account/login" class="menu-link button">Login</a>
            {/if}
          </header>
          <nav class="menu-options">
            <a href="/" class="menu-link">Hlavní stránka</a>
            <a href="/about" class="menu-link">Jak hrát</a>
            <a href="/contact" class="menu-link">O zvolSi.info</a>
          </nav>
          {#if auth}
            <div class="auth-links">
              <a href="/admin" class="menu-link">Admin</a>
            </div>
          {:else}
            <div class="auth-links">
              <a href="/account/login" class="menu-link button">Login</a>
              <a href="/account/register" class="menu-link button">Registrovat se</a>
            </div>
          {/if}
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
        width: 25%; 
        color: var(--background-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
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
        width: 120px;  
        border-right: 0.5px solid rgba(0, 0, 0, 0.358);
 
     }


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

    .menu-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
  }
  .menu-link {
    text-decoration: none;
    color: #333;
    font-size: 0.95rem;
    padding: 10px;
    border-radius: 6px;
    transition: background 0.3s ease, transform 0.3s ease;
    text-align: center;
  }

  .menu-link:hover {
    background: #f0f0f0;
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

    .auth-links {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .button {
    background: #2575fc;
    color: #fff !important;
  }
  .button:hover {
    background: #1a5acb;
  }

  .sidebar-header {
  background: linear-gradient(135deg, #ff020279, #b8bcc2);
  color: #fff;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  font-family: sans-serif;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column; /* change to column layout */
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column; /* stack icon and details */
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

 .logout-btn {
  background: #ff4b2b69;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
}
  .logout-btn:hover {
    background: #d5d3d3cb;
  }
  
</style>