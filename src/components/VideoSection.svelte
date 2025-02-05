<script>
    let videos = [
        { title: "Pristanie na mesiaci", subtitle: "Konšpiračná teória", duration: "12:00min", image: "/moon.jpg" },
        { title: "Legenda Nicolasa Cage", subtitle: "Filmový Deepfake", duration: "07:00min", image: "/nicolas-cage.jpg" }
    ];
</script>

<div class="video-section">
    {#each videos as video}
        <div class="video-card">
            <img src={video.image} alt={video.title} />
            <div class="video-info">
                <h2>{video.title}</h2>
                <p>{video.subtitle}</p>
                <span>{video.duration}</span>
            </div>
            <button class="play-btn">▶</button>
        </div>
    {/each}
</div>

<style>
    .video-section {
        flex: 1;
        background: #222;
        color: white;
        display: flex;
        flex-direction: column;
        padding: 20px;
    }

    .video-card {
        background: black;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        margin-bottom: 20px;
    }

    .video-card img {
        width: 100%;
        height: auto;
    }

    .video-info {
        padding: 15px;
    }

    .play-btn {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: red;
        border: none;
        color: white;
        padding: 10px;
        font-size: 20px;
        cursor: pointer;
        border-radius: 50%;
    }
</style>
