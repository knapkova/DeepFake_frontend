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
    <Modal title="Vědel jsi, že..." backdropClass=true bind:open={showFunFact} size="xs" color="red" autoclose class="w-full">
      <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{header}</p>
      <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{text}</p>
      <svelte:fragment slot="footer">
        <Button>Pokračovat</Button>
      </svelte:fragment>
    </Modal>
  </div>
{/if}
