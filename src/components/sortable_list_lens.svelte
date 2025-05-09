<script lang="ts">
    import { onMount } from 'svelte';
    import { dndzone, type Item } from 'svelte-dnd-action';

    export let onComplete: (sorted: boolean) => void = () => {};

  
    const CORRECT_ITEMS: Item[] = [
      { id: '1', content: 'Fotku stáhni nebo vyscreenshotuj' },
      { id: '2', content: 'Ve vyhledávací liště na Googlu klikni na ikonku foťáku' },
      { id: '3', content: 'Vlož svůj soubor do Google Lens' },
      { id: '4', content: 'Klikni na zobrazit přesné shody' },
      { id: '5', content: 'Z nabídnutého seznamu vyber stránku, na které se fotka objevila' }
    ];

    let message = ""
  
    let list: Item[] = [];
    let sortedCorrectly = false;
  
    function shuffle<T>(arr: T[]): T[] {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  
    onMount(() => {
      list = shuffle(CORRECT_ITEMS);
    });
  
    function handleConsider(e) {
      list = e.detail.items;
    }
    function handleFinalize(e) {
      list = e.detail.items;
    }
  
    // Nová funkce: kontrola pořadí
    function checkOrder() {
    sortedCorrectly =
      list.map(item => item.id).join(',') ===
      CORRECT_ITEMS.map(item => item.id).join(',');
    message = sortedCorrectly ? "" : "Zkus to znovu!";
    // zavoláme callback v rodiči
    onComplete(sortedCorrectly);
  }
  </script>
  
  <ul
    use:dndzone={{ items: list, flipDurationMs: 150 }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
  >
    {#each list as {id, content} (id)}

      <li class="draggable"> <img src="/draggable.svg" alt="Draggable icon" width=20rem/>   {content}</li>
    {/each}
  </ul>
  
  <!-- tlačítko pro manuální kontrolu pořadí -->
  <button on:click={checkOrder}>
    Zkontrolovat pořadí
  </button>
  
  {#if sortedCorrectly}
    <p class="success">🎉 Správně seřazeno!</p>
  {/if}

  {#if message}
    <p class="try-again">{message}</p>
  {/if}
  

  <style>

    ul {
      list-style: none;
      padding: 0;
      max-width: 40rem;  /* šířka seznamu */
      margin: 1rem auto; /* centrovat */
    }
  
    li.draggable {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      cursor: grab;
      transition: background 0.2s ease, box-shadow 0.2s ease,
                  transform 0.1s ease;
    }
  
    li.draggable:hover {
      background: #f9fbfd;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  
    li.draggable:active {
      cursor: grabbing;
      transform: scale(0.98);
    }
  
    /* placeholder při přetahování */
    .dnd-placeholder {
      border: 2px dashed #cbd5e1;
      border-radius: 0.5rem;
      height: 2.5rem;
      margin-bottom: 0.5rem;
    }
  
    /* zpráva o úspěchu */
    .success {
      text-align: center;
      color: #16a34a;
      margin-top: 1rem;
      font-weight: 600;
    }
    .try-again{
        text-align: center;
      color: #d68282;
      margin-top: 1rem;
      font-weight: 600;

    }
  </style>