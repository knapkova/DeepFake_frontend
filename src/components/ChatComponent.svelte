<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
  
    // Chat visibility and notification
    let showChat = false;
    let unread = true;
  
    // Tip structure
    interface Tip { id: number; text: string; correct: boolean; }
  
    let tips: Tip[] = [
      { id: 1, text: 'Podívat se na názor, se kterým nesouhlasím – a zkusit ho pochopit, ne rovnou odmítnout.', correct: true },
      { id: 2, text: 'Ověřit si zprávu, která potvrzuje, co si myslím – právě ty bývají nejzrádnější.', correct: true },
      { id: 3, text: 'Říct si: „Nevím. Zjistím si víc.“ – a necítit se kvůli tomu hloupě.', correct: true },
      { id: 4, text: 'Zastavit se, když cítím silnou emoci – nadechnout se, a chvíli neklikat nebo nesdílet dál.', correct: true },
      { id: 5, text: 'Věřit hlavně tomu, co sdílí moji přátelé – ti by mi přece nelhali.', correct: false },
      { id: 6, text: 'Pokud má zpráva hodně lajků, určitě je pravdivá.', correct: false }
    ];
  
    let available = [...tips];
    let reaction: Tip[] = [];
    let trash: Tip[] = [];
    let submitted = false;
    let success = false;
  
    function toggleChat() {
      showChat = !showChat;
      unread = false;
    }
  
    function allowDrop(event: DragEvent) {
      event.preventDefault();
    }
  
    function onDragStart(event: DragEvent, tip: Tip) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(tip));
    }
  
    function onDropZone(event: DragEvent, zone: 'reaction' | 'trash') {
      event.preventDefault();
      const data = event.dataTransfer?.getData('text/plain');
      if (!data) return;
      const tip: Tip = JSON.parse(data);
      // Remove from available if present
      available = available.filter(t => t.id !== tip.id);
      if (zone === 'reaction') {
        reaction = [...reaction, tip];
      } else {
        trash = [...trash, tip];
      }
    }
  
    function handleSubmit() {
      submitted = true;
      // Check if all correct in reaction and all incorrect in trash
      success = reaction.every(t => t.correct) && trash.every(t => !t.correct) &&
                reaction.length === tips.filter(t => t.correct).length;
    }
  </script>
  
  <!-- Floating chat button -->
  <div class="fixed bottom-4 right-4">
    <button
      class="bg-blue-600 text-white p-4 rounded-full shadow-lg relative"
      on:click={toggleChat}
      aria-label="Open chat"
    >
      💬 otevri chatik
      {#if unread}
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      {/if}
    </button>
  </div>
  
  {#if showChat}
    <!-- Chat window -->
    <div class="fixed bottom-20 right-4 w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col">
      <!-- Header -->
      <div class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-t-lg">
        Nová zpráva
      </div>
      <!-- Messages -->
      <div class="flex-1 p-2 overflow-y-auto space-y-4">
        <!-- Explanation message -->
        <div class="bg-gray-100 p-3 rounded-lg max-w-full">
          <p>Na tom něco je! Ověřovat každou informaci, se kterou se na internetu setkáme, opravdu není reálné. Konfirmační zkreslení se navíc nevyhýbá nikomu.</p>
          <p class="mt-2 font-semibold">Dobrá zpráva ale je, že proti němu existuje obrana: kritické myšlení. To funguje jako taková kontrolka, která vysílá signál, že je něco podezřelé a možná by stálo za to zpomalit a informaci prozkoumat podrobněji.</p>
        </div>
        <!-- Arrow indicator -->
        <div class="text-center text-gray-500">➡️</div>
        <!-- Task message -->
        <div class="bg-gray-100 p-3 rounded-lg max-w-full">
          <p class="font-semibold">Zadání:</p>
          <p>Vyber tipy, které pomáhají budovat kritické myšlení. Správné přesuň do reakčního příspěvku, špatné odhoď do koše.</p>
        </div>
        <!-- Drag & drop area -->
        <div class="grid grid-cols-2 gap-2">
          <div
            class="p-2 bg-white border rounded-lg h-32 overflow-y-auto"
            on:dragover|preventDefault={allowDrop}
            on:drop={(e) => onDropZone(e, 'reaction')}
          >
            <p class="font-bold text-sm mb-1">Reakční příspěvek</p>
            {#each reaction as tip}
              <div class="bg-green-100 p-1 rounded mb-1 text-xs">{tip.text}</div>
            {/each}
          </div>
          <div
            class="p-2 bg-white border rounded-lg h-32 overflow-y-auto"
            on:dragover|preventDefault={allowDrop}
            on:drop={(e) => onDropZone(e, 'trash')}
          >
            <p class="font-bold text-sm mb-1">Koš</p>
            {#each trash as tip}
              <div class="bg-red-100 p-1 rounded mb-1 text-xs">{tip.text}</div>
            {/each}
          </div>
        </div>
        <!-- Available tips -->
        <div class="mt-2 space-y-1">
          {#each available as tip}
            <div
              class="bg-gray-200 p-1 rounded cursor-move text-xs"
              draggable="true"
              on:dragstart={(e) => onDragStart(e, tip)}
            >
              {tip.text}
            </div>
          {/each}
        </div>
      </div>
      <!-- Footer: Submit or final message -->
      <div class="p-2 border-t">
        {#if !submitted}
          <button
            class="w-full bg-blue-600 text-white py-1 rounded disabled:opacity-50"
            on:click={handleSubmit}
            disabled={!(reaction.length + trash.length === tips.length)}
          >
            Odeslat
          </button>
        {:else}
          <div class="space-y-2">
            {#if success}
              <div class="bg-green-100 p-2 rounded text-sm">
                „Super otázka! Ověřovat úplně všechno nejde, ale můžeš se naučit pár triků:
                Dávej pozor, když ti něco hned sedne do tvého přesvědčení – to je právě chvíle na ověření.
                Občas si zkus přečíst i názor, se kterým nesouhlasíš.
                A hlavně – neboj se si přiznat, že něco nevíš a potřebuješ další informace.
                Každý krok se počítá a uvědomění, že náš mozek není bezchybný, je skvělý začátek.” ❤
              </div>
            {:else}
              <div class="bg-red-100 p-2 rounded text-sm">
                Nesprávné rozřazení. Zkus to znovu! 🚫
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
  