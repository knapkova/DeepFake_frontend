<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms'
	// `data` comes from the server load function
	export let data: PageData;
    const {form, errors,message} = superForm(data.form)
</script>

<form use:enhance method="post">
	<div>
		<label for="header">header</label>
		<input
			id="header"
			type="text"
			name="header"
			bind:value={$form.header}
			required
		/>
		{#if $errors.header}
			<div class="error">{$errors.header}</div>
		{/if}
	</div>

	<div>
		<label for="text">text</label>
		<textarea
			id="text"
			name="text"
			bind:value={$form.text}
			required
		></textarea>
		{#if $errors.text}
			<div class="error">{$errors.text}</div>
		{/if}
	</div>

	<div>
		<label for="manipulativeParts">manipulativeParts (JSON)</label>
		<textarea
			id="manipulativeParts"
			name="manipulativeParts"
			bind:value={$form.manipulativeParts}
			required
		></textarea>
		{#if $errors.manipulativeParts}
			<div class="error">{$errors.manipulativeParts}</div>
		{/if}
	</div>

	<button type="submit">Vytvořit</button>
</form>

{#if $message}
	<div class="update-message">{$message}</div>
{/if}
