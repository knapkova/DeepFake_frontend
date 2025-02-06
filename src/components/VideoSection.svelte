<script>
    import { onMount } from 'svelte';
    import '../global.css';

    /** @type {Array<{coverPhoto: string, name: string, description: string, duration: string}>} */
    let videos = [];

    onMount(async () => {
        try {
            const apiRoot = import.meta.env.VITE_API_ROOT;
            console.log("API root:", apiRoot);
            const response = await fetch(`${apiRoot}/api/Admin/Categories/GetActiveCategories`);
            if (response.ok) {
                videos = await response.json();
            } else {
                console.error('Failed to fetch videos:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    });
</script>


<div class="video-section">
    {#each videos as video}
    <div class="selection">
    <button class="play-btn"> ▷</button>
        <div class="video-card" style="background-image: url({video.coverPhoto});">
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
        font-size: 35px;
        padding: 5px 10px;
        background: #ff0000;
        color: white;
        border: none;
        cursor: pointer;
        font-weight: bold;
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