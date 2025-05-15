<script lang="ts">
  import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
  
  // Control modal visibility from parent via binding.
  export let showNewsletter: boolean;
  
  // Multistep form state
  let step = 1;
  let userType: "educator" | "student" | "" = "";
  let name = "";
  let age = "";
  let gender = "";
  let email = "";

  // Moves to the next step.
  function nextStep() {
    step = step + 1;
  }
  
  // Moves to the previous step.
  function previousStep() {
    step = step - 1;
  }

  // Process the educator subscription form submission.
  function subscribe(e: Event) {
    e.preventDefault();
    console.log("User type:", userType);
    console.log("Name:", name);
    console.log("Age:", age);
    console.log("Gender:", gender);
    console.log("Email:", email);
    // Process subscription data here then close modal.
    closeForm();
  }
  
  // Closes the modal and resets the form.
  function closeForm() {
    showNewsletter = false;
    step = 1;
    userType = "";
    name = "";
    age = "";
    gender = "";
    email = "";
  }
</script>

<Modal bind:open={showNewsletter} size="xs" autoclose={false} class="w-full">
  {#if step === 1}
    <!-- Step 1: Select user type -->
    <div class="flex flex-col space-y-6 p-4">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Kdo jste?</h3>
      <p class="text-gray-700">Vyberte jednu možnost:</p>
      <div class="flex space-x-4">
        <Button on:click={() => { userType = "educator"; nextStep(); }} class="w-full">
          Vzdělavatel
        </Button>
        <Button on:click={() => { userType = "student"; nextStep(); }} class="w-full">
          Student
        </Button>
      </div>
    </div>
  {:else if step === 2}
    <!-- Step 2: Ask for Name -->
    <div class="flex flex-col space-y-6 p-4">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Jak se jmenujete?</h3>
      <Label class="space-y-2">
        <span>Jméno</span>
        <Input type="text" bind:value={name} placeholder="Zadejte své jméno" required />
      </Label>
      <div class="flex justify-between">
        <Button on:click={previousStep} type="button" class="w-full bg-gray-300 hover:bg-gray-400">
          Zpět
        </Button>
        <Button on:click={nextStep} type="button" class="w-full">
          Pokračovat
        </Button>
      </div>
    </div>
  {:else if step === 3}
    <!-- Step 3: Ask for Age -->
    <div class="flex flex-col space-y-6 p-4">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Kolik je vám let?</h3>
      <Label class="space-y-2">
        <span>Věk</span>
        <Input type="number" bind:value={age} placeholder="Zadejte svůj věk" required />
      </Label>
      <div class="flex justify-between">
        <Button on:click={previousStep} type="button" class="w-full bg-gray-300 hover:bg-gray-400">
          Zpět
        </Button>
        <Button on:click={nextStep} type="button" class="w-full">
          Pokračovat
        </Button>
      </div>
    </div>
  {:else if step === 4}
    <!-- Step 4: Ask for Gender using Radio Buttons-->
    <div class="flex flex-col space-y-6 p-4">
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">Jaké je vaše pohlaví?</h3>
      <Label class="space-y-2">
        <span>Pohlaví</span>
        <div class="flex space-x-4">
          <label class="flex items-center space-x-1">
            <input type="radio" bind:group={gender} value="Muž" required />
            <span>Muž</span>
          </label>
          <label class="flex items-center space-x-1">
            <input type="radio" bind:group={gender} value="Žena" required />
            <span>Žena</span>
          </label>
          <label class="flex items-center space-x-1">
            <input type="radio" bind:group={gender} value="Jiné" required />
            <span>Jiné</span>
          </label>
        </div>
      </Label>
      <div class="flex justify-between">
        <Button on:click={previousStep} type="button" class="w-full bg-gray-300 hover:bg-gray-400">
          Zpět
        </Button>
        <Button on:click={nextStep} type="button" class="w-full">
          Pokračovat
        </Button>
      </div>
    </div>
  {:else if step === 5}
    <!-- Step 5: Final step – show content based on user type -->
    {#if userType === 'educator'}
      <form class="flex flex-col space-y-6 p-4" on:submit={subscribe}>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">Zůstaňte s námi v kontaktu</h3>
        <Label class="space-y-2">
          <span>Email</span>
          <Input type="email" name="email" placeholder="vas@email.cz" bind:value={email} required />
        </Label>
        <div class="flex items-start">
          <Checkbox>
            <div class="label text-sm">
              Souhlasím se zpracováním své emailové adresy v souladu se 
              <a href="https://zvolsi.info/legal/zasady-ochrany-osobnich-udaju-a-cookies" target="_blank" class="text-blue-500">
                zásadami ochrany osobních údajů
              </a>
            </div>
          </Checkbox>
        </div>
        <div class="flex justify-between">
          <Button on:click={previousStep} type="button" class="w-full bg-gray-300 hover:bg-gray-400">
            Zpět
          </Button>
          <Button type="submit" class="w-full">Chci zůstat v kontaktu</Button>
        </div>
      </form>
    {:else if userType === 'student'}
      <div class="flex flex-col space-y-6 p-4">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">Sleduj nás na Instagramu!</h3>
        <p class="text-gray-700">
          Děkujeme! Pro více informací a novinky sleduj náš profil na 
          <a href="https://www.instagram.com/yourprofile" target="_blank" class="text-blue-500 underline">
            Instagramu
          </a>.
        </p>
        <div class="flex justify-between">
          <Button on:click={previousStep} type="button" class="w-full bg-gray-300 hover:bg-gray-400">
            Zpět
          </Button>
          <Button on:click={closeForm} class="w-full">Zavřít</Button>
        </div>
      </div>
    {/if}
  {/if}
</Modal>