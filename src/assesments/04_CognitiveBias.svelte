<script lang="ts">
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import type { AssignmentCognitiveBias } from '$types/interfaces';
    import {flip} from "svelte/animate";
    import {dndzone } from "svelte-dnd-action";
    import type {DndEvent} from "svelte-dnd-action";


    const category_id = 10;
    const get_req = '/api/Admin/AssignmentCognitiveBias/GetAssignmentsCognitiveBiasByCategoryId/' + category_id;

    let bias = writable<AssignmentCognitiveBias[]>([]);
    const definitions = writable<string[]>([]);
    const userAnswers = writable<Record<number, string>>({});

    let state: 'start' | 'definition' | 'examples' | 'end' = 'start';
    let message_correct = '';
    let message_bad = '';

    // New state variables for evaluation
    let evaluation: Record<number, 'correct' | 'wrong'> = {};
    let evaluated = false;

    const flipDurationMs = 300;
    function handleDndConsider(e: CustomEvent<DndEvent<AssignmentCognitiveBias>>) {
        bias.set(e.detail.items);
    }
    function handleDndFinalize(e: CustomEvent<DndEvent<AssignmentCognitiveBias>>) {
        bias.set(e.detail.items);
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
            definitions.set(biases.map(item => item.definition));
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
        biasesArray.forEach(bia => {
            if (answers[bia.id] === bia.definition) {
                evaluation[bia.id] = 'correct';
                correct++;
            } else {
                evaluation[bia.id] = 'wrong';
            }
        });
        evaluated = true;
        if(correct === biasesArray.length) {
            message_bad = '';
            message_correct = 'Všechny odpovědi jsou správné! Jsi připraven pokračovat dále?';
        } else {
            message_correct = '';
            message_bad = 'Některé odpovědi jsou špatné. Zkus to znovu.';
        }
    }
</script>

<style>
    .assessment-section {
        padding: 1.5rem;
        max-width: 800px;
        margin: 2rem auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .card {
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 1.5rem;
    }
    .card-header {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    .card-body {
        font-size: 1rem;
        color: #495057;
    }
    select.form-select {
        display: block;
        width: 100%;
        padding: 0.375rem 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        margin-top: 0.5rem;
    }
    /* Highlight correct answers green and wrong red */
    .correct-answer {
        border-color: green;
    }
    .wrong-answer {
        border-color: red;
    }
    button.check-btn {
        padding: 0.5rem 1rem;
        font-weight: 600;
        border: none;
        background-color: #007bff;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
    }
    button.check-btn:hover {
        background-color: #0069d9;
    }
</style>


<div class="assessment-section">
    <h2>Kognitivní zkreslení</h2>
    
    {#if message_bad}
        <div class="alert alert-danger" role="alert">
            {message_bad}
        </div>
    {/if}
    
{#if state == 'definition'}
{#if message_correct}
        <div class ="alert alert-success" role="alert">
            {message_correct}
            <button class="btn btn-primary" on:click={() => {
                state = 'examples';
                message_correct = '';
                message_bad = '';
            }}>Pokračovat</button>
        </div>
    {/if}
    {#each $bias as bia}
        <div class="card">
            <div class="card-header">
                {bia.cognitiveBias}
            </div>
            <div class="card-body">
                <p><strong>Vyberte správnou definici:</strong></p>
                <select 
                    class="form-select {evaluated ? (evaluation[bia.id] === 'correct' ? 'correct-answer' : 'wrong-answer') : ''}" 
                    on:change={(e) => {
                        userAnswers.update(a => ({ ...a, [bia.id]: e.target.value }));
                    }}>
                    <option value="">-- Vyberte definici --</option>
                    {#each $definitions as option}
                        <option value={option}>{option}</option>
                    {/each}
                </select>
            </div>
        </div>
    {/each}
    <button class="check-btn" on:click={checkDefinitions}>Zkontrolovat definice</button>
    {/if}
    {#if state=='examples'}
    {#each $bias as bia}
    <div class="card">
        <div class="card-header">
            {bia.cognitiveBias}
        </div>
        <div class="card-body">
            <p><strong>Definice</strong></p>
            <select>
                    <option>{bia.definition}</option>
            </select>
        </div>
        
    </div>
{/each}
<section use:dndzone={{ items: $bias, flipDurationMs }} 
             on:consider={handleDndConsider} 
             on:finalize={handleDndFinalize}>
        {#each $bias as item (item.id)}
            <div animate:flip={{ duration: flipDurationMs }}>{item.example}</div>
        {/each}
    </section>
    {/if}
    {#if state === 'start'}
        <button class="btn btn-primary" on:click={() => state = 'definition'}>Začít</button>
    
    
    
    
    {/if}
</div>