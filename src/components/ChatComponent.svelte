<script lang="ts">
	import { onMount } from 'svelte';
	export let onStartGame: () => void = () => {};
	export let onTotalEnd: () => void = () => {};

	// Chat visibility and notification
	let showChat = false;
	let unread = true;



	export let storyEndType: 'begin' | 'end' = 'begin';

	const beginMessages = [
		`Ověřovat si každou informaci na internetu je nereálné, na to nikdo nemá čas. Někdy si
     stačí uvědomit, kdo a proč danou zprávu sdílel, a jakou se ve mně snaží vyvolat reakci.`,
		`Takovému přístupu se říká <b>kritické myšlení.</b>`,
		`To funguje jako taková kontrolka, která vysílá signál, že je něco podezřelé a možná by
     stálo za to zpomalit a informaci prozkoumat podrobněji.`
	];
	const endMessages = [
		`Super otázka!`,
		`Ověřovat úplně všechno nejde, ale můžeš se naučit pár triků:`,
		`Dávej pozor, když ti něco hned sedne do tvého přesvědčení – to je právě chvíle na ověření. Občas si zkus přečíst i názor, se kterým nesouhlasíš. A hlavně – neboj se si přiznat, že něco nevíš a potřebuješ další informace.`,
		`Každý krok se počítá a uvědomění, že náš mozek není bezchybný, je skvělý začátek.`
	];
	let endVisibleCount = 0;
	function showNextEnd() {
		if (endVisibleCount < endMessages.length) {
			endVisibleCount += 1;
		}
	}
	let visibleCount = 0;

	// call this onClick or onMount for auto‐advance
	function showNext() {
		if (visibleCount < beginMessages.length) {
			visibleCount += 1;
		}
	}

	// Tip structure

	let submitted = false;

	let highlightButton = true;
	function removeHighlight() {
		highlightButton = false;
	}

	function toggleChat() {
		showChat = !showChat;
		unread = false;
	}

	function beginGame() {
		onStartGame();
	}

	function endGame(){
		showChat = false;
		onTotalEnd();

	}
</script>

{#if highlightButton}
	<div class="overlay" on:click={removeHighlight}></div>
{/if}

<button class="chat-btn" on:click={toggleChat} aria-label="Open chat">
	💬 Nová zpráva
	{#if unread}
		<span class="unread-dot"></span>
	{/if}
</button>

{#if showChat}
	<div class="chat-window">
		<div class="chat-header">Nová zpráva od @realjan47</div>
		<div class="chat-messages">
			<div class="incoming-message">
				<img src="/anonym.png" alt="Avatar" class="message-avatar" />
				<div class="chat-message-from">
					<p>
						Čau, podle tvého návodu jsem si zkusil ten obrázek najít a fakt máš pravdu. Byl to záběr
						z filmu. A já tomu doteď věřil 🙏. Jak tě vůbec vůbec napadlo si ten příspěvek ověřit?
						Mně to na první pohled dávalo docela smysl.
					</p>
				</div>
			</div>
			{#if storyEndType === 'begin'}
				{#each beginMessages.slice(0, visibleCount) as msg}
					<div class="task-message" on:click={showNext}>
						{@html msg}
					</div>
				{/each}

				{#if visibleCount < beginMessages.length}
					<button on:click={showNext}>→</button>
				{:else}
					<button on:click={beginGame}>👉 Odpovědět Janovi </button>
				{/if}
			{:else}
				{#each endMessages.slice(0, endVisibleCount) as msg}
					<div class="task-message-to" on:click={showNextEnd}>
						<p>{@html msg}</p>
						<img src="/anonym.png" alt="Vaše avatar" class="message-avatar" />
					</div>
				{/each}

				{#if endVisibleCount < endMessages.length}
					<button on:click={showNextEnd}>Další →</button>
				{:else}
					<div class="incoming-message">
						<img src="/anonym.png" alt="Avatar" class="message-avatar" />
						<div class="chat-message-from">
							<p>Díky! To zní jako plán. 👍</p>
						</div>
					</div>
  					<button on:click={endGame}>Zavřít chat</button>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style>
	.task-message-to {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		margin-bottom: 1rem;
	}
	.task-message-to p {
		background: #e1ffc7;
		padding: 0.75rem 1rem;
		border-radius: 1rem;
		max-width: 80%;
		border-bottom-right-radius: 0;
	}
	.task-message-to .message-avatar {
		margin-left: 0.5rem;
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}

	.incoming-message {
		display: flex;
		align-items: flex-end; /* avatar sits at bubble’s bottom */
		margin-bottom: 1rem;
	}

	.message-avatar {
		width: 10%;
		border-radius: 50%;
		margin-right: 0.5rem;
	}

	.chat-message-from {
		background: #f3f4f6;
		padding: 0.75rem 1rem;
		border-radius: 1rem;
		max-width: 80%;
	}
	/* Highlight overlay */
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}

	/* Chat button */
	.chat-btn {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		background-color: #3583e8;
		color: white;
		padding: 0.75rem;
		border: none;
		border-radius: 10%;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		z-index: 11;
		    animation: bounce 4s infinite;

	}
	.unread-dot {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 0.5rem;
		height: 0.5rem;
		background: #ef4444;
		border-radius: 50%;
	}

	/* Chat window */
	.chat-window {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		width: 20rem;
		height: 24rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
		z-index: 12;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.chat-header {
		background: #2563eb;
		color: white;
		padding: 0.5rem 1rem;
		font-weight: bold;
	}
	.chat-messages {
		flex: 1;

		padding: 0.75rem;
		overflow-y: auto;
	}
	.chat-message-from {
		background: #f3f4f6;
		padding: 1.5rem;
		margin-bottom: 0.75rem;
		font-size: 0.9rem;
		border-radius: 20%;
		border-bottom-left-radius: 0%;
	}

	.task-message {
		background: #f3f4f6;
		padding: 0.5rem;
		border-radius: 6px;
		margin-bottom: 0.75rem;
		font-size: 0.9rem;
	}
	@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

	
</style>
