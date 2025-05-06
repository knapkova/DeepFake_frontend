<script lang="ts">

let rotation = 0;
$: fill = `${(rotation/360*100).toFixed(1)}%`;



const emotions = [
    '😡 hněv', // hněv
    '😢 smutek', // smutek
    '😱 strach', // strach
    '😮 překvapení', // překvapení
    '😄 radost', // radost
    '😂 smích', // smích
    '😞 zklamání', // zklamání
    '😟 úzkost', // úzkost
    '😍 láska', // láska
    '😤 frustrace', // frustrace
    '😩 vyčerpání', // vyčerpání
    '😇 nevinnost'  // nevinnost
  ];

  let selectedIndices: number[] = [];

  function toggleSelect(i: number) {
    const pos = selectedIndices.indexOf(i);
    if (pos > -1) {
      // odznačit
      selectedIndices.splice(pos, 1);
      selectedIndices = [...selectedIndices];
    } else if (selectedIndices.length < 3) {
      // přidat, pokud je méně než tři
      selectedIndices = [...selectedIndices, i];
    }
  }

  
</script>

<div class="slider-container">
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          style="--fill: {fill}"
          bind:value={rotation}
        />
        <div class="slider-label">Rotace 🔄</div>
      </div>
      <div>
<div class="wheel-wrapper">
    
    <ul
    class="wheel-of-fortune"
    style="--items: {emotions.length}; transform: rotate({rotation}deg)"
  >
    {#each emotions as emo, i}
      <li style="--idx: {i  + 1}">
        <button  class:selected={selectedIndices.includes(i)}
        on:click={() => toggleSelect(i)}
        disabled={!selectedIndices.includes(i) && selectedIndices.length >= 3}
        >{emo}</button>
      </li>
    {/each}
  </ul>
</div>

  
</div>
   
<style>

.wheel-wrapper {
    width: 45rem;      /* upravte podle potřeby */
    height: 45rem;     /* musí být stejné jako šířka */
    margin: 0 auto;    /* vycentruje kolo */
  }

  .slider-container {
    width: 80%;
    max-width: 300px;
    margin: 1rem auto;      /* center horizontally */

    text-align: center;
  }
  .slider-container input[type="range"] {
    width: 100%;
  }



:where(.wheel-of-fortune) {
 --_items: 12;

all: unset;
clip-path: inset(0 0 0 0 round 50%);

 aspect-ratio: 1 / 1;
background: #F0F4F8; 

 container-type: inline-size;
direction: ltr;
display: grid;
 place-content: center start;
}

li {
align-content: center;
display: grid;
font-size: 5cqi;
grid-area: 1 / -1;
list-style: none;
padding-left: 1ch;
transform-origin: center right;
width:  50cqi;

 &:nth-of-type(1) { --_idx: 1; }
     &:nth-of-type(2) { --_idx: 2; }
     &:nth-of-type(3) { --_idx: 3; }
     &:nth-of-type(4) { --_idx: 4; }
     &:nth-of-type(5) { --_idx: 5; }
     &:nth-of-type(6) { --_idx: 6; }
     &:nth-of-type(7) { --_idx: 7; }
     &:nth-of-type(8) { --_idx: 8; }
     &:nth-of-type(9) { --_idx: 9; }
     &:nth-of-type(10) { --_idx: 10; }
     &:nth-of-type(11) { --_idx: 11; }
     &:nth-of-type(12) { --_idx: 12; }

 rotate: calc(360deg / var(--_items) * calc(var(--_idx) - 1));


height: calc((2 * pi *  50cqi) / var(--_items));
clip-path: polygon(0% 0%, 100% 50%, 0% 100%);


}
button{
   clip-path: inset(0 0 0 0 round 50%);
   text-align: start;
   &:nth-of-type(1) { --_idx: 1; }
     &:nth-of-type(2) { --_idx: 2; }
     &:nth-of-type(3) { --_idx: 3; }
     &:nth-of-type(4) { --_idx: 4; }
     &:nth-of-type(5) { --_idx: 5; }
     &:nth-of-type(6) { --_idx: 6; }
     &:nth-of-type(7) { --_idx: 7; }
     &:nth-of-type(8) { --_idx: 8; }
     &:nth-of-type(9) { --_idx: 9; }
     &:nth-of-type(10) { --_idx: 10; }
     &:nth-of-type(11) { --_idx: 11; }
     &:nth-of-type(12) { --_idx: 12; }
     margin-left: -10%;
     padding-left: 70px ;


     background: #3B82F6;
     font-size: 25px;
 rotate: calc(360deg / var(--_items) * calc(var(--_idx) - 1));

height: calc((2 * pi *  50cqi) / var(--_items));
clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
}
button:hover,
button.selected {
   background-color: #e78e8e;  
   padding-left: 40px ;
   margin-left: -10%;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
  }


</style>