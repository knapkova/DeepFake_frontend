<script lang="ts">
import { Button, Modal, P } from 'flowbite-svelte';
export let showFunFact : boolean = false;
export let header = "header";
export let text = "text";

console.log("show:", showFunFact);
console.log("header:", header);
console.log("text:", text);
</script>

{#if showFunFact}
  <div class="fixed inset-0 z-40 bg-black/50 dark:bg-black/80">
    <Modal title="Vědel jsi, že..." backdropClass=true bind:open={showFunFact} size="lg" color="blue" autoclose class="w-full">
      <p class="fun-fact">{header}</p>
      <p class="source">Zdroj: {text}</p>
      <svelte:fragment slot="footer">
        <Button>Pokračovat</Button>
      </svelte:fragment>
    </Modal>
  </div>
{/if}

<style>
 .fun-fact {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .source {
    font-size: 0.7rem;
    color: #666;
    line-height: 1.5;
    font-style: italic;

  }
</style>
