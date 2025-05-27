<script lang="ts">
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import StarRating from '$lib/star-rating.svelte';
	import { onMount } from 'svelte';
	import type { Feedback } from '$types/interfaces';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	export let showNewsletter: boolean;

	const post_feedback_api = '/api/Admin/Feedback/Create';
 let currentFeedback: Feedback = {
    typeOfUser: '',
    name: '',
    age: 0,
    email: '',
    gender: '',
    newsletterApproved: false,
    stars: 0,
    id: 0,
    date: new Date(),
    feedbackFurther: ''
  };


	onMount(() => {
		
	});

  async function sendFeedback() {
    currentFeedback.date = new Date();
    const res = await fetch(
      `${PUBLIC_VITE_API_ROOT}${post_feedback_api}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentFeedback)
      }
    );
    if (!res.ok) console.error('Feedback error:', await res.text());
  }

	// Multistep form state
	let step = 0;
	

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
		
		closeForm();
	}

	// Closes the modal and resets the form.
	function closeForm() {
		showNewsletter = false;
		step = 1;
		
	}
</script>

<Modal bind:open={showNewsletter} size="xs" autoclose={false}>
  {#if step === 0}
    <div class="p-4 space-y-4">
      <h3>Jak se Vám hra líbila?</h3>
      <StarRating bind:rating={currentFeedback.stars} />
      <Input
        type="text"
        bind:value={currentFeedback.feedbackFurther}
        placeholder="Co můžeme zlepšit?"
        required
      />
    </div>
    <Button on:click={nextStep} class="w-full">Pokračovat</Button>

  {:else if step === 1}
    <div class="p-4 space-y-4">
      <h3>Kdo jste?</h3>
      <div class="flex gap-4">
        <Button on:click={() => { currentFeedback.typeOfUser = 'educator'; nextStep(); }} class="w-full">Vzdělavatel</Button>
        <Button on:click={() => { currentFeedback.typeOfUser = 'student'; nextStep(); }} class="w-full">Student</Button>
      </div>
    </div>

  {:else if step === 2}
    <div class="p-4 space-y-4">
      <h3>Jak se jmenujete?</h3>
      <Label>
        <Input
          type="text"
          bind:value={currentFeedback.name}
          placeholder="Vaše jméno"
          required
        />
      </Label>
      <div class="flex gap-4">
        <Button on:click={previousStep} class="w-full bg-gray-300">Zpět</Button>
        <Button on:click={nextStep} class="w-full">Pokračovat</Button>
      </div>
    </div>

  {:else if step === 3}
    <div class="p-4 space-y-4">
      <h3>Kolik je vám let?</h3>
      <Label>
        <Input
          type="number"
          bind:value={currentFeedback.age}
          placeholder="Věk"
          required
        />
      </Label>
      <div class="flex gap-4">
        <Button on:click={previousStep} class="w-full bg-gray-300">Zpět</Button>
        <Button on:click={nextStep} class="w-full">Pokračovat</Button>
      </div>
    </div>

  {:else if step === 4}
    <div class="p-4 space-y-4">
      <h3>Pohlaví</h3>
      <div class="flex gap-4">
        <label><input type="radio" bind:group={currentFeedback.gender} value="Muž" required /> Muž</label>
        <label><input type="radio" bind:group={currentFeedback.gender} value="Žena" required /> Žena</label>
        <label><input type="radio" bind:group={currentFeedback.gender} value="Jiné" required /> Jiné</label>
      </div>
      <div class="flex gap-4">
        <Button on:click={previousStep} class="w-full bg-gray-300">Zpět</Button>
        <Button on:click={() => { sendFeedback(); nextStep(); }} class="w-full">Odeslat zpětnou vazbu</Button>

      </div>
    </div>

  {:else if step === 5}
    {#if currentFeedback.typeOfUser === 'educator'}
      <form class="p-4 space-y-4" on:submit={subscribe}>
        <h3>Zůstaňte v kontaktu</h3>
        <Label>
          <span>Email</span>
          <Input
            type="email"
            bind:value={currentFeedback.email}
            placeholder="email@domena.cz"
            required
          />
        </Label>
        <div>
          <Checkbox bind:checked={currentFeedback.newsletterApproved} />
          <p>
          Chci dostávat informace o nových materiálech a dalších novinkách od Zvol si info a souhlasím se zpracováním své emailové adresy za tímto účelem v souladu se <u><a href="https://zvolsi.info/legal/zasady-ochrany-osobnich-udaju-a-cookies" target="_blank">zásadami ochrany osobních údajů</a></u> </p>
        </div>
        <div class="flex gap-4">
          <Button on:click={previousStep} class="w-full bg-gray-300">Zpět</Button>
          <Button on:click={sendFeedback} type="submit" class="w-full">Odeslat</Button>
        </div>
      </form>
    {:else}
      <div class="p-4 space-y-4">
        <h3>Sleduj nás na Instagramu!</h3>
        <p>Díky! Pro novinky navštiv <a href="https://instagram.com" target="_blank">Instagram</a>.</p>
        <Button on:click={closeForm} class="w-full">Zavřít</Button>
      </div>
    {/if}
  {/if}
</Modal>

<style>
  a {
    color: var(--primary-color);
    text-decoration: none;

  }
  p{
    font-size: smaller;
  }

 </style>