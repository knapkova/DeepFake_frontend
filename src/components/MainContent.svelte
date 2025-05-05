<script>
    import { onMount } from "svelte";
    import zvolsiinfoSidebar from '../assets/zvolsiingo_redLogo.png'
    import '../global.css';
    export let marginRight = '30%';

</script>

<div class="main-content" style="margin-right: {marginRight};">
    <h3 class="gray">Quiz</h3>
    <h1>Klamárium</h1>
    <div class="info" >
        <div class="funfact">
            <h3>Co je deepfake?</h3>
            <p>Video nebo zvuk vytvořený umělou inteligencí, který vypadá jako opravdový.</p>
          </div>
          <div class="funfact">
            <h3>Co je kognitivní zkreslení?</h3>
            <p>Chyba v našem uvažování, díky které vidíme to, co chceme vidět.</p>
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
    .funfact {
        border-radius: 10px;
        padding: 20px;
        margin: 10px;
        width: 300px;
        box-shadow: 3px 4px 3px 5px rgba(0, 0, 0, 0.2);

    }

    .funfact p{
        font-size: 16px;
        color: #333;
        font-weight: lighter;
        font-family: 'Courier New', Courier, monospace;
    }

</style>
