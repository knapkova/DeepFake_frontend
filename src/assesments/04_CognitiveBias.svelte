<script lang="ts">
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import type { AssignmentCognitiveBias } from '$types/interfaces';
    import Board from '$lib/dnd_board.svelte';
    import '../styles/04_dnd.css';



    const category_id = 10;
    const get_req = '/api/Admin/AssignmentCognitiveBias/GetAssignmentsCognitiveBiasByCategoryId/' + category_id;

    let bias = writable<AssignmentCognitiveBias[]>([]);
    const definitions = writable<string[]>([]);
    let examples = writable<string[]>([]);
    const userAnswers = writable<Record<number, string>>({});

    let state: 'start' | 'definition' | 'examples' | 'end' = 'start';
    let message_correct = '';
    let message_bad = '';

    // New state variables for evaluation
    let evaluation: Record<number, 'correct' | 'wrong'> = {};
    let evaluated = false;


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
            examples.set(biases.map(item => item.example));
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


    $: columnItems = [
        ...$bias.map(b => ({
            id: b.id,
            name: b.cognitiveBias,
            definition: b.definition,
            correct_example: b.example,
            card_error: false,
            items: [] 
        })),
        {
            id: 'examples',
            name: 'Příklady',
            definition:'',
            card_error: false,
            correct_example: '',

            items: $bias.flatMap(b => {
                // Make sure b.definition is an array
                const defs = Array.isArray(b.example) ? b.example : [b.example];
                // Return each definition as an item.
                return defs.map((def, idx) => ({
                    id: `${b.id}-${idx}`,
                    name: def
                }));
            })
        }
    ];
</script>




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
    <Board {columnItems} />
    {/if}

    {#if state === 'start'}
        <button class="btn btn-primary" on:click={() => state = 'definition'}>Začít</button>
        {/if}



</div>
