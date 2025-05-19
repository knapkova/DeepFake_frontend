<script lang="ts">
    import { Modal, Button } from 'flowbite-svelte';
  
    // Control modal visibility via binding.
    export let showLensExplanation: boolean;
  
    // Multistep state for the explanation.
    let step = 1;
      const totalSteps = 7;

  
    function nextStep() {
      step += 1;
    }
  
    function previousStep() {
      step -= 1;
    }
  
    function closeModal() {
      showLensExplanation = false;
      step = 1; // Reset to first step.
    }
    $: progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
  </script>
  
  <div class="block space-y-4 md:space-y-0 md:space-x-4 rtl:space-x-reverse">
    <Modal title="How to... Google Lens" bind:open={showLensExplanation} size="lg" >
        <div class="progress-container">
            <div class="progress-bar" style="width: {progressPercent}%;"></div>
          </div>
          
      {#if step === 1}
        <!-- Step 1: Intro -->
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            Jak zjistit původ fotky pomocí Google Lens
          </h3>
          <p class="text-gray-700">
            Zjistit původ jakékoli fotky nebo obrázku je lehčí, než si možná myslíš. Nemusíš být žádný ajťák! Vše, co potřebuješ, je Google – přesněji: Google Lens.
          </p>
          <img src="lens_tutorial/lens_0.webp" alt="Úvodní ukázka Google Lens" class="mx-auto w-full max-w-md rounded-lg object-contain"   style="max-width: 200px;"
          />
          <div class="flex justify-end">
            <Button on:click={nextStep} class="mt-4">Pokračovat</Button>
          </div>
  
      {:else if step === 2}
        <!-- Step 2: The challenge -->
        <div class="p-6 space-y-4 text-center">
          <p class="text-gray-700">
            Představ si, že potřebuješ zjistit, z jaké pohádky je tahle princezna.
          </p>
          <img src="lens_tutorial/lens_1.png" alt="Princezna z pohádky" class="mx-auto w-full max-w-md rounded-lg object-contain" />
          <div class="flex justify-between">
            <Button on:click={previousStep} class="mt-4">Zpět</Button>
            <Button on:click={nextStep} class="mt-4">Pokračovat</Button>
          </div>
        </div>
  
      {:else if step === 3}
        <!-- Step 3: How to start -->
        <div class="p-6 space-y-4 text-center">
          <p class="text-gray-700">
            Nejprve si fotku stáhni nebo udělej screenshot. Potom otevři Google a klikni na ikonku foťáku.
          </p>
          <img src="lens_tutorial/lens_2.png" alt="Google Lens – ikonka foťáku" class="mx-auto w-full max-w-sm rounded-lg object-contain" />
          <div class="flex justify-between">
            <Button on:click={previousStep} class="mt-4">Zpět</Button>
            <Button on:click={nextStep} class="mt-4">Pokračovat</Button>
          </div>
        </div>
  
      {:else if step === 4}
        <!-- Step 4: Uploading -->
        <div class="p-6 space-y-4 text-center">
          <p class="text-gray-700">
            Vyskočí ti okno, kam můžeš fotku nahrát.
          </p>
          <img src="lens_tutorial/lens_3.png" alt="Okno pro nahrání fotky" class="mx-auto w-full max-w-sm rounded-lg object-contain" />
          <div class="flex justify-between">
            <Button on:click={previousStep} class="mt-4">Zpět</Button>
            <Button on:click={nextStep} class="mt-4">Pokračovat</Button>
          </div>
        </div>
  
      {:else if step === 5}
        <!-- Step 5: Exact Matches -->
        <div class="p-6 space-y-4 text-center">
          <p class="text-gray-700">
            Okamžitě se ti zobrazí hromada výsledků. Pokud chceš mít jistotu, klikni na "Zobrazit přesné shody". Tato možnost se ti obvykle ukáže pod první fotkou.
          </p>
          <img src="lens_tutorial/lens_4.png" alt="Zobrazení přesných shod" class="mx-auto w-full max-w-xs rounded-lg object-contain" />
          <div class="flex justify-between">
            <Button on:click={previousStep} class="mt-4">Zpět</Button>
            <Button on:click={nextStep} class="mt-4">Pokračovat</Button>
          </div>
        </div>
  
      {:else if step === 6}
        <!-- Step 6: Identify the Source -->
        <div class="p-6 space-y-4 text-center">
          <p class="text-gray-700">
            Teď už bys měl/a vidět všechny stránky, kde se fotka objevila. Odtud je snadné zjistit, že princezna pochází z pohádky <strong>Princové jsou na draka</strong>.
          </p>
          <img src="lens_tutorial/lens_5.png" alt="Výsledky vyhledávání" class="mx-auto w-full max-w-md rounded-lg object-contain" />
          <div class="flex justify-between">
            <Button on:click={previousStep} class="mt-4">Zpět</Button>
            <Button on:click={nextStep} class="mt-4">Pokračovat</Button>
          </div>
        </div>
  
      {:else if step === 7}
        <!-- Step 7: Final message -->
        <div class="p-6 space-y-4 text-center">
          <p class="text-gray-700">
            Teď už víš, jak na to! Zkus to s fotkami, které sdílel Ivan, a zjisti, odkud si je Ivan "půjčil".
          </p>
          <div class="flex justify-end">
            <Button on:click={closeModal} class="mt-4">Zavřít</Button>
          </div>
        </div>
      {/if}
  
    </Modal>
  </div>

  <style>
    .progress-container {
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    margin: 16px 24px 0 24px;
  }
  .progress-bar {
    height: 100%;
    background-color: #3182ce;
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  </style>
  