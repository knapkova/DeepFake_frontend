<script lang="ts">
    // each section can be plain text (content) or a quiz (question/options/answer)
    type Section = {
      content?: string;
      question?: string;
      options?: Options[];
      answer?: string;
    };
    type Options = {
        answer: string;
        isCorrect: boolean;
        explanation: string;
    }
  
    let sections: Section[] = [
      {
        content: `Někteří lidé šíří dezinformace záměrně s cílem se obohatit nebo získat moc.
  Jiní se jen nedokáží zorientovat v záplavě informací.`
      },
      {
        question: `Zkusím je teda nějak přesvědčit. Jak je ale nejlépe konfrontovat?`,
        options: [
            {
              answer: `Upozornit je, že věří konspiračním teoriím..`,
              isCorrect: false,
              explanation: `Nálepkování většinou nikam nevede, budeš potřebovat lepší argument`
            },
            {
              answer: `Zesměšnit a zpochybnit důvěryhodnost Ivana.
`,
              isCorrect: false,
              explanation: `Útokem na “šiřitele pravdy” můžeš nechtěně podpořit konspirační teorii o tajném spiknutí.`
            },
            {
              answer: `Dokázat, že Ivan prezentuje nepravdivé informace.`,
              isCorrect: true,
              explanation: `Nejlepší způsob, jak konfrontovat dezinformace, je poskytnout důkazy a fakta.`
            }
        ],
      },
      {
        question: `Jak příspěvek nejlépe ověřit?`,
        options: [
          {
            answer:'Dohledat informace o tajné misi, kterou Ivan zmiňuje.',
            isCorrect: false,
            explanation: `Vždycky je těžší dokázat, že něco neexistuje, než naopak. Navíc, pokud je mise opravdu tajná, na internetu o ní žádné informace nenajdeš.`
          },
          {
            answer:'Ověřit, jestli náhodou nejsou vytržené z kontextu.',
            isCorrect: true,
            explanation: ``
          }

        ],
      },
      {
        question: `Tipni si odkud Ivan získal fotky z Marsu.`,
        options: [
          {
            answer: `Má kontakty ve vysoké politice.`,
            isCorrect: false,
            explanation: ``
          },
          {
            answer: `Naboural se do tajných archivů NASA.`,
            isCorrect: false,
            explanation: ``
          },
          {
            answer: `Fotky vůbec nejsou z Marsu.`,
            isCorrect: true,
            explanation: `` }

        ],
    },
      {
        content: `Tak pojď zjistit, jak to teda je…`
      }
    ];
  
    let selected: Array<Options|null> = Array(sections.length).fill(null);
  let feedback: Array<string>       = Array(sections.length).fill('');

  function checkAnswer(i: number) {
    const opt = selected[i];
    if (!opt) return;
    if (opt.isCorrect) {
      feedback[i] = 'Správně!';
    } else {
      feedback[i] = opt.explanation;
      // allow retry: keep selected[i] as null so they must re-choose
      selected[i] = null;
    }
  }
  </script>
  
  <main class="scroll-container">
    {#each sections as sec, i}
      <section class="snap-section">
        {#if sec.content}
               <div class="content">
                 {#each sec.content.split('\n') as line}
                   <p>{line}</p>
                 {/each}
               </div>
             {/if}  
        {#if sec.question}
          <div class="quiz">
            <p class="question">{sec.question}</p>
            {#each sec.options as opt}
              <label>
                <input
                  type="radio"
                  bind:group={selected[i]}
                  value={opt}
                  disabled={feedback[i] === 'Správně!'}
                />
                {opt.answer}
              </label>
            {/each}
  
            <button
              on:click={() => checkAnswer(i)}
              disabled={!selected[i] || feedback[i] === 'Správně!'}
            >
              Odeslat
            </button>
  
            {#if feedback[i]}
              <p class={feedback[i] === 'Správně!' ? 'correct' : 'incorrect'}>
                {feedback[i]}
              </p>
            {/if}
          </div>
        {/if}
      </section>
    {/each}
  </main>
  
  <style>
    .scroll-container {
      height: 100vh;
      overflow-y: auto;
      scroll-snap-type: y mandatory;
      -webkit-overflow-scrolling: touch;
      margin: 0;
    }
    .snap-section {
      scroll-snap-align: start;
      height: 100vh;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      color: #333;
      background: #f9f9f9;
    }
    .content p {
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    .quiz {
      margin-top: 1rem;
      background: rgba(255, 255, 255, 0.85);
      padding: 1rem;
      border-radius: 8px;
    }
    .quiz .question {
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .quiz label {
      display: block;
      margin: 0.5rem 0;
    }
    .quiz button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: #0070f3;
      border: none;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }
    .quiz button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .correct {
      margin-top: 0.75rem;
      color: #276749;
    }
    .incorrect {
      margin-top: 0.75rem;
      color: #742a2a;
    }
  </style>