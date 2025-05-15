<script lang="ts">
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { ManipulativeTextComments, ManipulativeMotivation } from '../types/interfaces';

	import { writable, get } from 'svelte/store';
	import type { AssignmentCognitiveBias } from '$types/interfaces';
	import Board from '$lib/dnd_board.svelte';
	import StoryEnd from '$components/Storyend.svelte';
	import '../styles/04_dnd.css';
	import ChatComponent from '$components/ChatComponent.svelte';
	import CommentsComponent from '$components/UsersComments.svelte';

	export let onLevelComplete: () => void = () => {};

	let inGame_end = false;
	let storyEndType: 'begin' | 'end' = 'begin';

	let chatDone = false;
	function handleChatEnd() {
		chatDone = true;
	}

	function handleStartGame_end() {
		inGame_end = true;
	}
	function handleAllCorrect_end(msg: string) {
		message_correct = msg;
		inGame_end = false;
		storyEndType = 'end';
	}

	function completeLevel() {
		onLevelComplete();
	}
	const manipilativeMot: ManipulativeMotivation = {
		id: 0,
		motivation: 'string',
		definition: 'string',
		manipulativeTextId: 0
	};

	let comments = writable<ManipulativeTextComments[]>([
		{
			id: 1,
			username: 'blanka_65',
			comment: 'Ten návod jsi určitě zfalšoval/a, to je z nějaký vládní stránky, ne?',
			manipulativeMotivationId: 2,
			manipulativeExplanation: '',
			manipulativeMotivation: manipilativeMot,
			manipulativeTextId: 101
		},
		{
			id: 2,
			username: 'eva.novakova9',
			comment: 'Tohle je jen další manipulace, přesně jako dělají média.',
			manipulativeMotivationId: 1,
			manipulativeExplanation: '',
			manipulativeMotivation: manipilativeMot,
			manipulativeTextId: 102
		},
		{
			id: 3,
			username: 'petr_neverim',
			comment: 'Hele, snažíš se nějak podezřele moc. Trochu se vyklidni.',
			manipulativeMotivationId: 0,
			manipulativeExplanation: '',
			manipulativeMotivation: manipilativeMot,
			manipulativeTextId: 103
		}
	]);

	let selected = writable<number[]>([]);
	let resultMessage = '';
	const options = [
		{
			id: 0,
			comment: 'Protože věří tomu, co si pamatují, i když to nemusí pravda.',
			explanation: ''
		},
		{
			id: 1,
			comment:
				'Protože jsi poskytl/a málo důkazů a lidé neměli dost informací, aby si udělali názor.',
			explanation:
				'Problém není v množství důkazů, ale v tom, že lidé často ignorují i silné důkazy, když jsou v rozporu s jejich přesvědčením.'
		},
		{
			id: 2,
			comment: 'Protože důkazy vnímají jako útok na svou identitu.',
			explanation: ''
		}
	];

	// Correct answers: option 0 and option 2.
	const correctAnswers = [0, 2];
	// Toggle option selection. Only allow up to 2 selections.
	function toggleOption(index: number) {
		selected.update((current) => {
			if (current.includes(index)) {
				return current.filter((i) => i !== index);
			} else if (current.length < 2) {
				return [...current, index];
			} else {
				return current; // already two selections are made; do nothing.
			}
		});
	}

	// Check if the selected options match the correct answers.
	function checkAnswers() {
		let sel: number[] = [];
		selected.subscribe((val) => (sel = val))();
		// Ensure there are exactly two selections.
		if (sel.length !== 2) {
			resultMessage = 'Prosím vyberte přesně dvě možnosti.';
			return;
		}
		sel.sort();
		const correctSorted = [...correctAnswers].sort();
		resultMessage =
			JSON.stringify(sel) === JSON.stringify(correctSorted)
				? 'Správně!'
				: 'Nesprávně. Zkuste to znovu.';
	}

	const category_id = 11;
	const get_req =
		'/api/Admin/AssignmentCognitiveBias/GetAssignmentsCognitiveBiasByCategoryId/' + category_id;

	let bias = writable<AssignmentCognitiveBias[]>([]);
	const definitions = writable<string[]>([]);
	let examples = writable<string[]>([]);
	const userAnswers = writable<Record<number, string>>({});

	let state: 'start' | 'reactions' | 'definition' | 'examples' | 'end' = 'start';
	let message_correct = '';
	let message_bad = '';

	// New state variables for evaluation
	let evaluation: Record<number, 'correct' | 'wrong'> = {};
	let evaluated = false;

	function handleAllCorrect(msg: string) {
		message_correct = msg;
	}

	onMount(async () => {
		try {
			const response = await fetch(PUBLIC_VITE_API_ROOT + get_req);
			const data = await response.json();
			let biases: AssignmentCognitiveBias[] = Array.isArray(data) ? data : [data];

			biases.forEach((item: AssignmentCognitiveBias) => {
				if (typeof item.definition === 'string') {
					try {
						item.definition = JSON.parse(item.definition);
					} catch (e) {
						console.error('Parsing definition failed for bias ID', item.id, e);
					}
				}
			});
			bias.set(biases);
			definitions.set(biases.map((item) => item.definition));
			examples.set(biases.map((item) => item.example));
		} catch (error) {
			console.error('Failed to fetch cognitive biases:', error);
		}
	});

	// Updated checkDefinitions function that evaluates each answer.
	function checkDefinitions() {
		const biasesArray = get(bias);
		const answers = get(userAnswers);
		evaluation = {};
		let correct = 0;
		biasesArray.forEach((bia) => {
			if (answers[bia.id] === bia.definition) {
				evaluation[bia.id] = 'correct';
				correct++;
			} else {
				evaluation[bia.id] = 'wrong';
			}
		});
		evaluated = true;
		if (correct === biasesArray.length) {
			message_bad = '';
			message_correct = 'Všechny odpovědi jsou správné! Jsi připraven pokračovat dále?';
		} else {
			message_correct = '';
			message_bad = 'Některé odpovědi jsou špatné. Zkus to znovu.';
		}
	}

	$: columnItems = [
		{
			id: 'examples',
			name: 'Doplň příklad k definici',
			definition: '',
			card_error: false,
			correct_example: '',

			items: $bias.flatMap((b) => {
				// Make sure b.definition is an array
				const defs = Array.isArray(b.example) ? b.example : [b.example];
				// Return each definition as an item.
				return defs.map((def, idx) => ({
					id: `${b.id}-${idx}`,
					name: def
				}));
			})
		},
		...$bias.map((b) => ({
			id: b.id,
			name: b.cognitiveBias,
			definition: b.definition,
			correct_example: b.example,
			card_error: false,
			items: []
		}))
	];

	let comments_visible = false;
</script>

<div class="assessment-section" in:fly={{ x: 300, duration: 400 }} out:fly={{ x: -300, duration: 400 }}>
	<h2>Kognitivní zkreslení</h2>

	{#if message_bad}
		<div class="alert alert-danger" role="alert">
			{message_bad}
		</div>
	{/if}

	{#if state === 'start'}
		<p>
			Pod tvým posledním komentářem s návodem, jak na ověření obrázků, se rozproudila diskuze. Jenže
			místo vděku přišla vlna hejtu. Někteří lidé nechtějí znát pravdu. Chtějí jen potvrzení toho,
			čemu už věří. A jakmile něco naruší jejich představu, brání se – silně, emotivně, někdy i
			útočně.
		</p>
		<button on:click={() => (comments_visible = !comments_visible)}>
			{comments_visible ? 'Skrýt komentáře' : '👉 Chci se podívat na reakce'}
		</button>
		{#if comments_visible}
			<CommentsComponent {comments} />

			<div class="quiz-container">
				<p class="question">
					❓Proč se ostatní lidé nepřidali na tvou stranu, i když jsi poskytl/a jasné důkazy? Vyber
					dva důvody:
				</p>
				<div class="options">
					{#each options as option, index}
						<div class="option">
							<label>
								<input
									type="checkbox"
									on:change={() => toggleOption(index)}
									checked={$selected.includes(index)}
									disabled={$selected.length === 2 && !$selected.includes(index)}
								/>
								{option.comment}
							</label>
						</div>
					{/each}
				</div>
				<button on:click={checkAnswers}> Zkontrolovat odpovědi </button>
				{#if resultMessage}
					<div
						class="feedback {resultMessage === 'Správně!' ? 'feedback-success' : 'feedback-error'}"
					>
						<p class="result">{resultMessage}</p>
						{#if resultMessage === 'Správně!'}
							<button class="next-btn" on:click={() => (state = 'definition')}>Začít</button>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	{/if}

	{#if state == 'definition'}
		<p>
			Ano! Ivan využil známé prostředí filmu (film Marťan je populární, spousta lidí jej viděla) a
			spoléhal na to, že lidé si tyto vizuály snadno spojí s realitou, což se také stalo. Navíc,
			jakmile jednou uvěřili, že na Marsu opravdu někdo je, vše další (např. fotky) jim připadalo
			důvěryhodnější. Těmto myšlenkovým zkratkám se říká KONFIRMAČNÍ ZKRESLENÍ. To znamená, že
			vyhledáváme a pamatujeme si hlavně to, co podporuje naše přesvědčení.
		</p>
		{#each $bias as bia}
			<div class="card">
				<div class="card-header">
					{bia.cognitiveBias}
				</div>
				<div class="card-body">
					<p><strong>Vyberte správnou definici:</strong></p>
					<select
						class="form-select {evaluated
							? evaluation[bia.id] === 'correct'
								? 'correct-answer'
								: 'wrong-answer'
							: ''}"
						on:change={(e) => {
							userAnswers.update((a) => ({ ...a, [bia.id]: e.target.value }));
						}}
					>
						<option value="">-- Vyberte definici --</option>
						{#each $definitions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</div>
			</div>
		{/each}
		{#if message_correct}
			<div class="alert alert-success" role="alert">
				{message_correct}
				<button
					on:click={() => {
						state = 'examples';
						message_correct = '';
						message_bad = '';
					}}>Pokračovat</button
				>
			</div>
		{:else}
			<button on:click={checkDefinitions}>Zkontrolovat definice</button>
		{/if}
	{/if}

	{#if state == 'examples'}
		<p>
			Přiřaď jednotlivá konfirmační zkreslení k situacím z příběhu. Najetím myší na žárovku 💡 se ti
			zobrazí nápověda.
		</p>
		<Board {columnItems} onAllCorrect={handleAllCorrect} />
		{#if message_correct}
			<div class="alert alert-success" role="alert">
				{message_correct}
				<button
					on:click={() => {
						state = 'end';
						message_correct = '';
						message_bad = '';
					}}>Pokračovat</button
				>
			</div>
		{/if}
	{/if}
</div>

{#if state == 'end'}
	<div class="alert-2 alert-success-2" role="alert">
		{#if !inGame_end && !chatDone}
			<ChatComponent
				bind:storyEndType
				onStartGame={handleStartGame_end}
				onTotalEnd={handleChatEnd}
			/>
		{:else if inGame_end}
			<StoryEnd onFinish={() => handleAllCorrect_end('')} />
		{/if}
		{#if chatDone}
			<div class="final-step">
				<p>Skvěle! Teď už víš, jak se bránit manipulaci.</p>
				<p>Jsi připraven své znalosti otestovat?</p>
				<button on:click={completeLevel}>Začít test</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.final-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding: 1rem 1.5rem;
    background: #f3f4f6;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    animation: fadeInUp 0.4s ease-out both;
  }

  .final-step p {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
    text-align: center;
  }
	.feedback {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 1.5rem;
		margin-top: 1.5rem;
		border-radius: 8px;
		animation: fadeInUp 0.3s ease-out both;
	}

	.feedback-success {
		background: #e6f4ea;
		border: 1px solid #28a745;
	}

	.feedback-error {
		background: #fbeaea;
		border: 1px solid #dc3545;
	}

	.feedback .result {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
		color: inherit;
	}
	.feedback-success .result,
	.feedback-success .next-btn {
		color: #28a745;
	}
	.feedback-error .result {
		color: #dc3545;
	}
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.assessment-section {
		padding: 2rem;
		background: #fafafa;
		border-radius: 12px;
		max-width: 900px;
		margin: 2rem auto;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		animation: fadeInUp 0.4s 0.2s ease-out both;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.assessment-section h2 {
		text-align: center;
		color: var(--color-primary);
		margin-bottom: 1.5rem;
		animation: fadeInUp 0.4s 0.2s ease-out both;
	}
	.alert {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		margin: 1rem 0;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		animation: fadeInUp 0.4s 0.2s ease-out both;
	}
	.alert-danger {
		background: #f8d7da;
		border: 1px solid #f5c2c7;
		color: #842029;
	}
	.alert-success {
		background: #d1e7dd;
		border: 1px solid #badbcc;
		color: #0f5132;
	}

	.result {
		font-weight: bold;
		margin-top: 0.5rem;
	}
	.quiz-container {
		background: #ffffff;
		padding: 1.5rem;
		border-radius: 8px;
		text-align: left;

		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
		margin: 1rem auto;
		max-width: 600px;
		animation: fadeInUp 0.4s 0.2s ease-out both;
	}
	.question {
		font-size: 1.2rem;
		margin-bottom: 1rem;
		color: #333;
	}
	.options {
		margin-bottom: 1rem;
	}
	.option {
		margin-bottom: 0.5rem;
		font-size: 1rem;
		color: #444;
	}
	.option label {
		cursor: pointer;
	}
	.option input {
		margin-top: 0.2rem;
		cursor: pointer;
	}

	.result {
		margin-top: 1rem;
		font-size: 1.1rem;
		font-weight: bold;
		color: #333;
	}
	 @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
