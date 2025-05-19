<script>
    export let marginRight = '30%';

</script>

<div class="main-content" style="margin-right: {marginRight};">
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
        background-image: url("/zvolsiinfo_QLogoTransparent.png") !important;
        background-size: cover !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        align-items: start;
        margin-right: 18px;
        color: black;
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
   
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

    @media screen and (max-width: 768px) {
    .main-content {
      margin-right: 0;
      padding: 0.75rem;
      background-position: top center;
    }
    .main-content h1 {
      font-size: 1.8rem;
    }
    .main-content .gray {
      font-size: 1rem;
    }
    .info {
      flex-direction: column;
      gap: 0.75rem;
    }
    .funfact {
      flex: 1 1 auto;
      width: 100%;
      box-shadow: none;
    }
  }

</style>
