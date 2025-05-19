<script lang="ts">
	export let onFinish: () => void = () => {};

interface Tip {
		id: number;
		text: string;
		correct: boolean;
	}
    let submitted = false;


	const tips: Tip[] = [
		{
			id: 1,
			text: 'Podívat se na názor, se kterým nesouhlasím – a zkusit ho pochopit, ne rovnou odmítnout.',
			correct: true
		},
		{
			id: 2,
			text: 'Ověřit si zprávu, která potvrzuje, co si myslím – právě ty bývají nejzrádnější.',
			correct: true
		},
		{
			id: 3,
			text: 'Říct si: „Nevím. Zjistím si víc.“ – a necítit se kvůli tomu hloupě.',
			correct: true
		},
		{
			id: 4,
			text: 'Zastavit se, když cítím silnou emoci – nadechnout se, a chvíli neklikat nebo nesdílet dál.',
			correct: true
		},
		{
			id: 5,
			text: 'Věřit hlavně tomu, co sdílí moji přátelé – ti by mi přece nelhali.',
			correct: false
		},
		{ id: 6, text: 'Pokud má zpráva hodně lajků, určitě je pravdivá.', correct: false }
	];

	let available = [...tips];
	let reaction: Tip[] = [];
	let trash: Tip[] = [];
	let success = false;

function allowDrop(e: DragEvent) {
		e.preventDefault();
	}

	function onDragStart(e: DragEvent, tip: Tip) {
		e.dataTransfer?.setData('text/plain', JSON.stringify(tip));
	}

	function onDropZone(e: DragEvent, zone: 'reaction' | 'trash') {
		e.preventDefault();
		const data = e.dataTransfer?.getData('text/plain');
		if (!data) return;
		const tip: Tip = JSON.parse(data);
		available = available.filter((t) => t.id !== tip.id);
		if (zone === 'reaction') reaction = [...reaction, tip];
		else trash = [...trash, tip];
	}

	function handleSubmit() {
		submitted = true;
		const correctCount = tips.filter((t) => t.correct).length;
		const incorrectCount = tips.filter((t) => !t.correct).length;
		success =
			reaction.length === correctCount &&
			trash.length === incorrectCount &&
			reaction.every((t) => t.correct) &&
			trash.every((t) => !t.correct);
        if (success) {
            onFinish();
        }
	}

	function resetQuiz() {
		available = [...tips];
		reaction = [];
		trash = [];
		submitted = false;
		success = false;
	}
</script>
	<h3 class="task"> Vyber tipy, které pomáhají budovat kritické myšlení. Správné přesuň do reakčního příspěvku, špatné odhoď do koše.</h3>

<div class="drag-container">

    <div class="drop-zone" on:dragover={allowDrop} on:drop={(e) => onDropZone(e, 'reaction')}>
        <h4>Reakční příspěvek</h4>
		<p><i>Co pomáhá</i></p>

        {#each reaction as tip}
            <div class="tip-item">{tip.text}</div>
        {/each}
    </div>
    <div class="drop-zone" on:dragover={allowDrop} on:drop={(e) => onDropZone(e, 'trash')}>
        <h4>Koš 🚮</h4>
		<p><i>Čemu se vyvarovat</i></p>
        {#each trash as tip}
            <div class="tip-item">{tip.text}</div>
        {/each}
    </div>
</div>

<div class="available-zone">
    {#each available as tip}
        <div class="tip-item" draggable="true" on:dragstart={(e) => onDragStart(e, tip)}>
            {tip.text}
        </div>
    {/each}
</div>

<div class="footer">
{#if !submitted}
    <button
        on:click={handleSubmit}
        disabled={reaction.length + trash.length !== tips.length}
    >
        Odeslat
    </button>

{:else}
    <div class="feedback-error">Nesprávné rozřazení. Zkus to znovu! 🚫</div>
    <button class="retry-button" on:click={resetQuiz}> Zkusit znovu </button>
{/if}
</div>

<style>
	.task {
		font-size: 1.1rem;
    margin: 1.5rem auto;
    padding: 0.75rem 1rem;
    background: #f0f8ff;
    border-left: 4px solid #3b82f6;
    border-radius: 4px;
    max-width: 800px;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    animation: fadeInUp 0.4s ease-out both;
	}
	
	/* Drag & drop */
	.drag-container {
		display: flex;
		gap: 1rem;
    margin-bottom: 1rem;
	}
	.drop-zone {
    flex: 1;
    padding: 1rem;
    background: #fdfdfd;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    min-height: 8rem;
    font-size: 0.9rem;
    color: #334155;
    transition: 
      background 0.2s ease, 
      border-color 0.2s ease, 
      box-shadow 0.2s ease;
  }

   .drop-zone:hover,
  .drop-zone.drag-over {
    background: #edf4f8;
    border-color: #9dbef2;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }

	.drop-zone h4 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
  }

	 .available-zone {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

	 .tip-item {
    padding: 0.5rem 0.75rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
	    margin: 0.2rem 0;
    border-radius: 6px;
    cursor: move;
    font-size: 0.9rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .tip-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }

	/* Footer & feedback */
	.footer {
    padding: 0.75rem;
    border-top: 1px solid #e5e7eb;
    text-align: center;
  }
   .feedback-error {
    background: #ffe3e3;
    color: #842029;
    padding: 0.5rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }

</style>
