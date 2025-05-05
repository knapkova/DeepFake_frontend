<script lang="ts">
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
  </script>
  
  <div class="error-container">
    <div class="error-card">
      <h1 class="error-status">{page.status}</h1>
      <p class="error-message">
        {page.error?.message ?? 'Něco se nepovedlo :('}
      </p>
      <button class="btn-home" on:click={() => goto('/')}>
        Vrátit se domů
      </button>
    </div>
  </div>
  
  <style>
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      background: var(--background-color, #f5f5f5);
      padding: 2rem;
    }
    .error-card {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 400px;
      width: 100%;
    }
    .error-status {
      font-size: 4rem;
      margin: 0;
      color: #e53e3e;
    }
    .error-message {
      margin: 1rem 0 2rem;
      color: #4a5568;
      line-height: 1.4;
    }
    .btn-home {
      background: #3182ce;
      color: #fff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s ease;
    }
    .btn-home:hover {
      background: #2b6cb0;
    }
  </style>