<script lang="ts">
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import StarRating from '$lib/star-rating.svelte';
	import type { Feedback } from '$types/interfaces';
	import { createFeedback } from '$lib/db/feedback';
	export let showNewsletter: boolean;

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

	// Players can only insert feedback (no update), so it is sent exactly once per game.
	let feedbackSent = false;

	async function sendFeedback() {
		if (feedbackSent) return;
		feedbackSent = true;
		try {
			await createFeedback(currentFeedback);
		} catch (e) {
			feedbackSent = false;
			console.error('Feedback error:', e);
		}
	}

	// Multistep form state
	let step = 0;

	function nextStep() {
		step = step + 1;
	}

	function previousStep() {
		step = step - 1;
	}

	// Students are done after the gender step; educators continue to the newsletter form first.
	async function finishQuestions() {
		if (currentFeedback.typeOfUser !== 'educator') {
			await sendFeedback();
		}
		nextStep();
	}

	// Educator newsletter form: the browser has already checked the e-mail and the consent box.
	async function subscribe(e: Event) {
		e.preventDefault();
		await sendFeedback();
		closeForm();
	}

	// Educator who doesn't want the newsletter: keep the feedback, drop the e-mail.
	async function skipNewsletter() {
		currentFeedback.email = '';
		currentFeedback.newsletterApproved = false;
		await sendFeedback();
		closeForm();
	}

	function closeForm() {
		showNewsletter = false;
		step = 0;
	}
</script>

<Modal bind:open={showNewsletter} size="xs" autoclose={false}>
	{#if step === 0}
		<div class="space-y-4 p-4">
			<h3>Jak se ti hra líbila?</h3>
			<StarRating bind:rating={currentFeedback.stars} />
			<Input
				type="text"
				bind:value={currentFeedback.feedbackFurther}
				placeholder="Co můžeme zlepšit?"
			/>
		</div>
		<Button on:click={nextStep} class="w-full">Pokračovat</Button>
	{:else if step === 1}
		<div class="space-y-4 p-4">
			<h3>Kdo jsi?</h3>
			<div class="flex gap-4">
				<Button
					on:click={() => {
						currentFeedback.typeOfUser = 'educator';
						nextStep();
					}}
					class="w-full">Vzdělavatel</Button
				>
				<Button
					on:click={() => {
						currentFeedback.typeOfUser = 'student';
						nextStep();
					}}
					class="w-full">Student</Button
				>
			</div>
		</div>
	{:else if step === 2}
		<div class="space-y-4 p-4">
			<h3>Jak se jmenuješ?</h3>
			<Label>
				<Input type="text" bind:value={currentFeedback.name} placeholder="Tvoje jméno" />
			</Label>
			<div class="flex gap-4">
				<Button on:click={previousStep} class="w-full bg-gray-300">Zpět</Button>
				<Button on:click={nextStep} class="w-full">Pokračovat</Button>
			</div>
		</div>
	{:else if step === 3}
		<div class="space-y-4 p-4">
			<h3>Kolik ti je let?</h3>
			<Label>
				<Input type="number" min="1" max="120" bind:value={currentFeedback.age} placeholder="Věk" />
			</Label>
			<div class="flex gap-4">
				<Button on:click={previousStep} class="w-full bg-gray-300">Zpět</Button>
				<Button on:click={nextStep} class="w-full">Pokračovat</Button>
			</div>
		</div>
	{:else if step === 4}
		<div class="space-y-4 p-4">
			<h3>Pohlaví</h3>
			<div class="flex gap-4">
				<label><input type="radio" bind:group={currentFeedback.gender} value="Muž" /> Muž</label>
				<label><input type="radio" bind:group={currentFeedback.gender} value="Žena" /> Žena</label>
				<label><input type="radio" bind:group={currentFeedback.gender} value="Jiné" /> Jiné</label>
			</div>
			<div class="flex gap-4">
				<Button on:click={previousStep} class="w-full bg-gray-300">Zpět</Button>
				<Button on:click={finishQuestions} class="w-full">Odeslat zpětnou vazbu</Button>
			</div>
		</div>
	{:else if step === 5}
		{#if currentFeedback.typeOfUser === 'educator'}
			<form class="space-y-4 p-4" on:submit={subscribe}>
				<h3>Zůstaň v kontaktu</h3>
				<Label>
					<span>E-mail</span>
					<Input
						type="email"
						bind:value={currentFeedback.email}
						placeholder="email@domena.cz"
						required
					/>
				</Label>
				<Checkbox bind:checked={currentFeedback.newsletterApproved} required>
					<span class="consent">
						Chci dostávat informace o nových materiálech a dalších novinkách od Zvol si info a
						souhlasím se zpracováním své e-mailové adresy za tímto účelem v souladu se
						<a
							href="https://zvolsi.info/legal/zasady-ochrany-osobnich-udaju-a-cookies"
							target="_blank"
							rel="noopener noreferrer"><u>zásadami ochrany osobních údajů</u></a
						>.
					</span>
				</Checkbox>
				<div class="flex gap-4">
					<Button on:click={skipNewsletter} class="w-full bg-gray-300">Ne, díky</Button>
					<Button type="submit" class="w-full">Odeslat</Button>
				</div>
			</form>
		{:else}
			<div class="space-y-4 p-4">
				<h3>Sleduj nás na Instagramu!</h3>
				<p>
					Díky! Pro novinky navštiv náš
					<a href="https://www.instagram.com/zvol_si_info/" target="_blank" rel="noopener noreferrer"
						>Instagram</a
					>.
				</p>
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
	p,
	.consent {
		font-size: smaller;
	}
</style>
