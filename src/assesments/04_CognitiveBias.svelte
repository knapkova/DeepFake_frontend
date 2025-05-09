<script lang="ts">
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import type { AssignmentCognitiveBias } from '$types/interfaces';
    import Board from '$lib/dnd_board.svelte';
    import '../styles/04_dnd.css';
	import { Button } from 'flowbite-svelte';
    export let onLevelComplete: () => void = () => {};

  function completeLevel() {
    onLevelComplete();
  }

  let comments = writable([
    { id: 1, username: 'blanka_65', comment: 'Ten návod jsi určitě zfalšoval/a, to je z nějaký vládní stránky, ne?' },
    { id: 2, username: 'eva.novakova9', comment: 'Tohle je jen další manipulace, přesně jako dělají média.' },
    { id: 3, username: 'petr_neverim', comment: 'Hele, snažíš se nějak podezřele moc. Trochu se vyklidni.' }
])

let selected = writable<number[]>([]);
  let resultMessage = "";
  const options = [
    {
      id: 0,
      comment: "Protože věří tomu, co si pamatují, i když to nemusí pravda.",
      explanation: ""
    },
    {
      id: 1,
      comment: "Protože jsi poskytl/a málo důkazů a lidé neměli dost informací, aby si udělali názor.",
      explanation: "Problém není v množství důkazů, ale v tom, že lidé často ignorují i silné důkazy, když jsou v rozporu s jejich přesvědčením."
    },
    {
      id: 2,
      comment: "Protože důkazy vnímají jako útok na svou identitu.",
      explanation: ""
    }
  ];


  
  // Correct answers: option 0 and option 2.
  const correctAnswers = [0, 2];
  // Toggle option selection. Only allow up to 2 selections.
  function toggleOption(index: number) {
    selected.update(current => {
      if (current.includes(index)) {
        return current.filter(i => i !== index);
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
    selected.subscribe(val => sel = val)();
    // Ensure there are exactly two selections.
    if (sel.length !== 2) {
      resultMessage = "Prosím vyberte přesně dvě možnosti.";
      return;
    }
    sel.sort();
    const correctSorted = [...correctAnswers].sort();
    resultMessage = JSON.stringify(sel) === JSON.stringify(correctSorted)
      ? "Správně!"
      : "Nesprávně. Zkuste to znovu.";
  }




    const category_id = 11;
    const get_req = '/api/Admin/AssignmentCognitiveBias/GetAssignmentsCognitiveBiasByCategoryId/' + category_id;

    let bias = writable<AssignmentCognitiveBias[]>([]);
    const definitions = writable<string[]>([]);
    let examples = writable<string[]>([]);
    const userAnswers = writable<Record<number, string>>({});

    let state: 'start' | 'reactions'| 'definition' | 'examples' | 'end' = 'start';
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
      {
            id: 'examples',
            name: 'Doplň příklad k definici',
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
        },
        ...$bias.map(b => ({
            id: b.id,
            name: b.cognitiveBias,
            definition: b.definition,
            correct_example: b.example,
            card_error: false,
            items: [] 
        })),
        
    ];

    let comments_visible = false;
</script>




<div class="assessment-section">
    <h2>Kognitivní zkreslení</h2>
    
    {#if message_bad}
        <div class="alert alert-danger" role="alert">
            {message_bad}
        </div>
    {/if}

    {#if state === 'start'}
        <p>
            Pod tvým posledním komentářem s návodem, jak na ověření obrázků, se rozproudila diskuze.
Jenže místo vděku přišla vlna hejtu.
Někteří lidé nechtějí znát pravdu. Chtějí jen potvrzení toho, čemu už věří. A jakmile něco naruší jejich představu, brání se – silně, emotivně, někdy i útočně.
        </p>
        <button on:click={() => comments_visible = !comments_visible}>
            {comments_visible ? 'Skrýt komentáře' : '👉 Chci se podívat na reakce'}
        </button>
        {#if comments_visible}
        <div class="comments-container">
            {#each $comments as comment}
              <div class="comment-card">
                <div class="profile-photo">🤥</div>
                <div class="comment-content">
                  <h4 class="comment-username">{comment.username}</h4>
                  <p class="comment-text">{comment.comment}</p>
                  <div class="comment-reactions">
                    <span>👍 {Math.floor(Math.random() * 500)}</span>
                    <span>❤️ {Math.floor(Math.random() * 300)}</span>
                    <span>😂 {Math.floor(Math.random() * 200)}</span>
                    <span>😡 {Math.floor(Math.random() * 30)}</span>
                    <span>💬 {Math.floor(Math.random() * 50)} odpovědí</span>
                  </div>
                </div>
            </div>
            {/each}
        </div>

        <div class="quiz-container">
            <p class="question">
              ❓Proč se ostatní lidé nepřidali na tvou stranu, i když jsi poskytl/a jasné důkazy? Vyber dva důvody:
            </p>
            <div class="options">
              {#each options as option, index}
                <div class="option">
                  <label>
                    <input 
                      type="checkbox" 
                      on:change={() => toggleOption(index)} 
                      checked={$selected.includes(index)}
                      disabled={$selected.length === 2 && !$selected.includes(index)} />
                    {option.comment}
                  </label>
                </div>
              {/each}
            </div>
            <button  on:click={checkAnswers}>
              Zkontrolovat odpovědi
            </button>
            {#if resultMessage}
              <p class="result">{resultMessage}</p>
              {#if resultMessage === "Správně!"}
    <button on:click={() => state = 'definition'}>
      Začít
    </button>
  {/if}
            {/if}
        </div>
        {/if}   

        {/if}

        
    
{#if state == 'definition'}

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
    {#if message_correct}
        <div class ="alert alert-success" role="alert">
            {message_correct}
            <button on:click={() => {
                state = 'examples';
                message_correct = '';
                message_bad = '';
            }}>Pokračovat</button>
        </div>
    {:else}
    <button on:click={checkDefinitions}>Zkontrolovat definice</button>

    {/if}
    {/if}

    {#if state=='examples'}
    <Board {columnItems} onAllCorrect={handleAllCorrect} />
    {#if message_correct}
        <div class ="alert alert-success" role="alert">
            {message_correct}
            <button  on:click={() => {
                state = 'end';
                message_correct = '';
                message_bad = '';
            }}>Pokračovat</button>
        </div>
    {/if}
    {/if}

    {#if state == 'end'}
        <div class="alert alert-success" role="alert">
            mega nejvesi borec!
            <button  on:click={() => completeLevel()}>Daal</button>

        </div>
    {/if}

    



</div>
<style>
  
  
  .comments-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .profile-photo {
    width: 50px;
    height: 50px;
    background: #ccc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-right: 1rem;
  }
  
  .comment-content h4,
  .comment-content p {
    margin: 0;
  }
  
  .comment-reactions {
    display: flex;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }
 
  
  .result {
    font-weight: bold;
    margin-top: 0.5rem;
  }
  .quiz-container {
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 8px;
    max-width: 600px;
    margin: 1rem auto;
  }
  .question {
    font-size: 1.2rem;
    font-weight: bold;
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

  .result {
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
  }
  </style>
  