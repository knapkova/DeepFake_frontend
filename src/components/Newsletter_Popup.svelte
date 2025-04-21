<script lang="ts">
    import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
    let formModal = true;
  </script>
  
  
  <Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
    <form class="flex flex-col space-y-6" action="#">
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Zůstaňte s námi v kontaktu</h3>
      <Label class="space-y-2">
        <span>Email</span>
        <Input type="email" name="email" placeholder="vas@email.cz" required />
      </Label>
      <div class="flex items-start">
        <Checkbox>
            <div class="label svelte-qo2p0s">
                Chci dostávat informace o nových materiálech a dalších novinkách od Zvol si info a souhlasím se zpracováním své emailové adresy za tímto účelem v souladu se <a href="https://zvolsi.info/legal/zasady-ochrany-osobnich-udaju-a-cookies" target="_blank">zásadami ochrany osobních údajů</a>
            </div>
        </Checkbox>
      </div>
      <Button type="submit" class="w-full1">Chci zůstat v kontaktu</Button>
    </form>
  </Modal>