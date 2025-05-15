<script lang="ts">
    import { onMount } from 'svelte';
    import type { Category } from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import { writable } from 'svelte/store';
  
    const request_get = '/api/Admin/Categories/GetActiveCategories';
    let categories = writable<Category[]>([]);
  
    onMount(async () => {
      const response = await fetch(PUBLIC_VITE_API_ROOT + request_get); 
      const data = await response.json();
      categories.set(data);
    });

    function navigate(dest:string){
      window.location.href = dest;
}
  </script>
  
  <div class="scrollable-container">
    {#each $categories as video (video.id)}
      <div class="selection">
        <button onclick={() => navigate("/marsGate")} class="play-btn">▷</button>
        <div
          class="video-card"
          style="background-image: url({video.imgSrc});"
        >
          <div class="video-info">
            <div class="video-text">
              <h2>{video.name}</h2>
              <p>{video.description}</p>
            </div>
            <h3>{video.duration}:00 min</h3>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <style>
    /* Container fixed on the right side */
    .scrollable-container {
      position: fixed;
      top: 0;
      right: 0;
      width: 30%;       
      height: 100vh;      
      background-color: #f1f1f1;
      overflow-y: auto;   
      display: flex;
      flex-direction: column;
      gap: 1rem;        
      padding-right: 1rem;
      padding-top: 1rem;

    }
  
    /* One “card” row: play button + thumbnail card */
    .selection {
      display: flex;
      align-items: flex-end;
    }
  
    .play-btn {
      align-self: flex-end;
      background-color: #ff0000;
      color: #fff;
      border: none;
      font-size: 24px;
      width: 72px;
      height: 72px;
      cursor: pointer;
    }
  
    /* The thumbnail container */
    .video-card {
      flex: 1;
      height: 440px;                  /* Adjust as needed */
      position: relative;
      background-size: cover;
      background-position: center;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
  
    /* Dark overlay with text at the bottom */
    .video-info {
      position: absolute;
      bottom: 0;
      left: 0; 
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  
    .video-info h2 {
      margin: 0 0 0.25rem;
      font-size: 2rem;
    }
  
    .video-info p {
      margin: 0;
      font-size: 0.8rem;
      font-family: 'Courier New', Courier, monospace;

    }
  
    .video-info h3 {
      margin: 0;
      font-size: 0.9rem;
      white-space: nowrap;
    }
  </style>
  