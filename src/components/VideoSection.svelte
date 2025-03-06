<script lang="ts">
    import { onMount } from 'svelte';
    import type { Category } from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import { writable } from 'svelte/store';


    import '../global.css';

    const request_get = '/api/Admin/Categories/GetCategories';
    let categories = writable<Category[]>([]);

    onMount(async () => {
      const response = await fetch(PUBLIC_VITE_API_ROOT + request_get); 
      const data = await response.json();
      categories.set(data);
      console.log(data);
    });
</script>


<div class="video-section">
    {#each $categories as video}
    <div class="selection">
    <button class="play-btn"> ▷</button>
        <div class="video-card" style="background-image: url({video.imgSrc});">
            <div class="video-info">
                <div>
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
    .video-section {
        flex: 1;
        background: rgb(206, 205, 205);
        color: white;
        display: flex;
        flex-wrap: wrap;
    }

    .video-card {
        flex: 1 1 calc(50% - 20px); 
        display: flex;
        flex-direction: row;
        background-size: cover;

        background-position: center;
        padding: 10px;
        color: white;
        min-width: 500px; 
        
    }

    .video-info {
        margin-top: auto;
        background: rgba(0, 0, 0, 0.8);
        padding: 10px;
        display: flex;
        justify-content: space-between;
    }

    
    .video-info p {
        margin: 5px 0;
        font-size: 14px;
        
    }

    .play-btn {
        max-height: 20%;
        max-width: 20%;
        aspect-ratio: 1;
        font-size: 30px;
        padding: 5px 10px;
        background: #ff0000;
        color: white;
        border: none;
        cursor: pointer;
    }

    .duration{
        color: white;
        font-weight: bold;
    }
    .selection{
        display: flex;
        flex-direction: row;
    }


    
</style>