<script lang="ts">
import { Button, Modal } from 'flowbite-svelte';
export let showFunFact : boolean = true;
export let header = "header";
export let text = "text";

console.log("show:", showFunFact);
console.log("header:", header);
console.log("text:", text);
</script>


<Modal title="Terms of Service" bind:open={showFunFact} size="xs" color = 'green' autoclose class="w-full">
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{header}</p>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{text}</p>
    <svelte:fragment slot="footer">
      <Button>Pokračovat</Button>
    </svelte:fragment>
</Modal>