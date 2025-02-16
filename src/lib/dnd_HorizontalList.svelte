<script>
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';

    export let items;
    export let containerWidth = '30vw';
    export let itemWidth = '15vw';
    export let singleSelection = false;
    export let onItemDropped = (event) => {}; // Accept callback prop

    const flipDurationMs = 300;

    function handleDndConsider(e) {
        items = e.detail.items;
    }

    function handleDndFinalize(e) {
        items = [...e.detail.items]; // Create a new array reference

    // Call parent function (matchHeadline.svelte) if provided
    if (onItemDropped) {
        onItemDropped({ items });
    }
    }
</script>

<style>
    section {
        height: 160px;
        padding: 0.3em;
		background-color: lightgray;
		border-left: red 1px solid;
        display: flex;
        overflow-x: scroll;
    }
    div {
        height: fit-content;
        display: inline-block;
        padding: 0.9em;
        border: 1px solid rgb(167, 167, 169);
        margin: 0 0.15em;
    }
</style>

{#if singleSelection}
    <section 
        style="width:20vw" 
        use:dndzone={{
            items, 
            flipDurationMs, 
            dropFromOthersDisabled: items.length >= 1
        }} 
        on:consider={handleDndConsider} 
        on:finalize={handleDndFinalize}
    >
        {#each items as item (item.id)}
            <div style="flex: 0 0 {itemWidth}" animate:flip={{ duration: flipDurationMs }}>
                {item.text}
            </div>
        {/each}
    </section>
{:else}
    <section 
        style="width:{containerWidth}" 
        use:dndzone={{ items, flipDurationMs }} 
        on:consider={handleDndConsider} 
        on:finalize={handleDndFinalize}
    >
        {#each items as item (item.id)}
            <div style="flex: 0 0 {itemWidth}" animate:flip={{ duration: flipDurationMs }}>
                {item.text}
            </div>
        {/each}
    </section>
{/if}
