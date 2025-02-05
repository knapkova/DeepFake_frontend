<script>
    import { onMount } from "svelte";
    import zvolsiinfoSidebar from '../assets/zvolsiingo_redLogo.png'
</script>

<div class="main-content">
    <h2>Quiz</h2>
    <h1>Otestuj se v deepfaku!</h1>
    <div class="info" >
        <div class="funfact">
            <h3>Co je to Deepfake?</h3>
            <p>Technologie, která díky AI dokáže manipulovat videa.</p>
        </div>
        <div class="funfact">
            <h3>Původ slova</h3>
            <p>Deepfakes (složenina slov "deep learning" a "fake").</p>
        </div>
    </div>
</div>

<style>
    .info{
        display: flex;
        justify-content: space-between;
    }
    .funfact{
        width: 45%;
    }

    .main-content {
        color: black;
        flex: 2;
        padding: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-image: url("../assets/zvolsiinfo_QLogoTransparent.png"); /* Update with your image path */
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    h1 {
        font-size: 40px;
        font-weight: bold;
    }

    h3 {
        font-size: 18px;
    }

    .info {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .info div {
        width: 45%;
    }
</style>
