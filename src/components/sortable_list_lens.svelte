<script lang="ts">
  import { onMount } from 'svelte';
  import { dndzone, type Item } from 'svelte-dnd-action';
  import { fly } from 'svelte/transition';
  import { nickname} from "$stores/app";
  import FbPost from "$components/FbPost.svelte"
  import CommentComponent, {} from  "$components/CommentComponent.svelte"


	export let onComplete: (sorted: boolean) => void = () => {};

	const CORRECT_ITEMS: Item[] = [
		{ id: '1', content: 'Fotku stáhni nebo vyscreenshotuj' },
		{ id: '2', content: 'Ve vyhledávací liště na Googlu klikni na ikonku foťáku' },
		{ id: '3', content: 'Vlož svůj soubor do Google Lens' },
		{ id: '4', content: 'Klikni na zobrazit přesné shody' },
		{ id: '5', content: 'Z nabídnutého seznamu vyber stránku, na které se fotka objevila' }
	];

	let status: 'start' | 'comment' = 'start' as 'start' | 'comment'; //todo start

	let message = '';

	let list: Item[] = [];
	let sortedCorrectly = false;

	function shuffle<T>(arr: T[]): T[] {
		const a = arr.slice();
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	onMount(() => {
		list = shuffle(CORRECT_ITEMS);
	});

	function handleConsider(e) {
		list = e.detail.items;
	}
	function handleFinalize(e) {
		list = e.detail.items;
	}

	// Nová funkce: kontrola pořadí
	function checkOrder() {
		sortedCorrectly =
			list.map((item) => item.id).join(',') === CORRECT_ITEMS.map((item) => item.id).join(',');
		message = sortedCorrectly ? '' : 'Zkus to znovu!';
		// zavoláme callback v rodiči
	}

  const fullMessage = `Fotky, které Ivan sdílí, nejsou z Marsu. Jsou z Jordánska, kde se natáčel film Marťan. Můžete si to sami ověřit, tady je, jak na to:
Fotku stáhni nebo vyscreenshotuj
Ve vyhledávací liště na Googlu klikni na ikonku foťáku
Vlož svůj soubor do Google Lens
Klikni na zobrazit přesné shody
Z nabídnutého seznamu vyber stránku, na které se fotka objevila`;

  let typedMessage = '';
  let typingStarted = false;
  let typinngFinished = false;

  async function startTyping() {
    typedMessage = '';
    for (const char of fullMessage) {
      typedMessage += char;
      await new Promise((r) => setTimeout(r, 20));
    }
    typinngFinished = true;
  }

  $: if (status != 'start' && !typingStarted) {
    typingStarted = true;
    startTyping();
  }
</script>

{#if status === 'start'}
<div class="wrapper" in:fly={{ x: 300, duration: 400 }} out:fly={{ x: -300, duration: 400 }}>

<h4>Zpětné vyhledávání obrázků přes vyhledávač máš za sebou. Nebylo to tak těžké, co? Škoda, že tohle neví každý, pak by si mohl informace snadno ověřit… Tak co, kdybychom je to naučili!</h4>
      <p>Sestav správné pořadí jednotlivých kroků pro vyhledání obrázku přes Google Lens:
      </p>
	<ul
		use:dndzone={{ items: list, flipDurationMs: 150 }}
		on:consider={handleConsider}
		on:finalize={handleFinalize}
	>
		{#each list as { id, content } (id)}
			<li class="draggable">
				<img src="/draggable.svg" alt="Draggable icon" width="20rem" />
				{content}
			</li>
		{/each}
	</ul>

	<button on:click={checkOrder}> Zkontrolovat pořadí </button>

	{#if sortedCorrectly}
		<p class="success">🎉 Správně seřazeno!</p>
    <button on:click={() => { status = 'comment'; }}>Pokračovat</button>
	{/if}

	{#if message}
		<p class="try-again">{message}</p>
	{/if}
	</div>

{/if}

{#if status === 'comment'}

  <div class="comment-box" in:fly={{ x: 300, duration: 400 }} out:fly={{ x: -300, duration: 400 }}>
    <div class="post-wrapper">
	  <CommentComponent usersComment={typedMessage}/>
    </div>
    <div class="comment-wrapper">
      {#if typinngFinished && typedMessage != 'Komentář odeslán :)'}
        <button on:click={() => {onComplete(typinngFinished), typedMessage = 'Komentář odeslán :)';}}>
          Odeslat komentář
        </button>
      {/if}
    </div>
  </div>

  

{/if}

<style>
	.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fafafa;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    animation: fadeIn 0.4s ease-out both;
  }

  h4 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: #333;
    text-align: center;
  }

  p {
    margin-bottom: 1.5rem;
    color: #555;
    line-height: 1.5;
  }

  ul {
    list-style: none;
    padding: 0;
    width: 100%;
    max-width: 40rem;
    margin: 0 auto 1.5rem;
  }

  
  /* Success / Retry messages */
  .success,
  .try-again {
    text-align: center;
    font-weight: 600;
    margin-top: 1rem;
  }
  .success {
    color: #16a34a;
  }
  .try-again {
    color: #d68282;
  }

  /* Comment section */
  .comment-box {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin: 2rem auto 0;
    padding: 1rem;
    background: #f0f2f5;
    border-radius: 12px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
    animation: fadeIn 0.4s ease-out both;
  }

  .post-wrapper {
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .comment-wrapper {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  /* Subtle fade-in */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
	ul {
		list-style: none;
		padding: 0;
		max-width: 40rem; /* šířka seznamu */
		margin: 1rem auto; /* centrovat */
	}
	

	li.draggable {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		margin-bottom: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		display: flex;
		align-items: center;
		cursor: grab;
		transition:
			background 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.1s ease;
	}

	li.draggable:hover {
		background: #f9fbfd;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	li.draggable:active {
		cursor: grabbing;
		transform: scale(0.98);
	}


</style>
