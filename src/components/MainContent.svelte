<script>
    import { onMount } from "svelte";
    import zvolsiinfoSidebar from '../assets/zvolsiingo_redLogo.png'
    import '../global.css';
</script>

<div class="main-content">
    <h3 class="gray">Quiz</h3>
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
    .main-content {
        background-image: url("../assets/zvolsiinfo_QLogoTransparent.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        align-items: start;
        margin-right: 18px;

    }

</style>
