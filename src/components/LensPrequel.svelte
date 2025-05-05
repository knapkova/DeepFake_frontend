<script lang="ts">
    /**
     * @deprecated Use callback props and/or the $host() rune instead — see migration guide
     */
    export let marginRight: string = '0';
    /** Callback for when quiz completes */
    export let onComplete: () => void = () => {};
  
    interface Option { value: string; label: string; correct: boolean; explanation?: string; }
    interface Step { header: string; text?: string; options?: Option[]; }
  
    const steps: Step[] = [
      {
        header: 'Úroveň vlastní tvorby',
        text: `Někteří lidé šíří dezinformace záměrně s cílem se obohatit nebo získat moc.
  Jiní se jen nedokáží zorientovat v záplavě informací.
  Zkusím je teda nějak přesvědčit.`
      },
      {
        header: '1) Jak je ale nejlépe konfrontovat?',
        options: [
          { value: 'labeling', label: 'Upozornit je, že věří konspiračním teoriím.', correct: false,
            explanation: 'Nálepkování většinou nikam nevede, budeš potřebovat lepší argument.' },
          { value: 'mocking', label: 'Zesměšnit a zpochybnit důvěryhodnost Ivana.', correct: false,
            explanation: 'Útokem na „šiřitele pravdy“ můžeš nechtěně podpořit konspirační teorii o tajném spiknutí.' },
          { value: 'correct', label: 'Dokázat, že Ivan prezentuje nepravdivé informace.', correct: true }
        ]
      },
      {
        header: '2) Jak příspěvek nejlépe ověřit?',
        options: [
          { value: 'search-mission', label: 'Dohledat informace o tajné misi, kterou Ivan zmiňuje.', correct: false,
            explanation: 'Vždycky je těžší dokázat, že něco neexistuje, než naopak. Navíc, pokud je mise opravdu tajná, na internetu o ní žádné informace nenajdeš.' },
          { value: 'context', label: 'Ověřit, jestli náhodou nejsou vytržené z kontextu.', correct: true }
        ]
      },
      {
        header: '3) Tipni si, odkud Ivan získal fotky z Marsu.',
        options: [
          { value: 'contacts', label: 'Má kontakty ve vysoké politice.', correct: false,
            explanation: 'Fotky vůbec nejsou z Marsu – většinou pocházejí z bezplatných galerií nebo simulátorů.' },
          { value: 'hack', label: 'Naboural se do tajných archivů NASA.', correct: false,
            explanation: 'Fotky vůbec nejsou z Marsu – většinou pocházejí z bezplatných galerií nebo simulátorů.' },
          { value: 'correct', label: 'Fotky vůbec nejsou z Marsu.', correct: true }
        ]
      },
      {
        header: 'Co dál?',
        text: 'Tak pojď zjistit, jak to teda je…'
      }
    ];
  
    const totalSteps = steps.length;
    let currentStep: number = 0;
    let score: number = 0;
  
    let selected: string | null = null;
    let feedback: string = '';
    let explanation: string = '';
  
    function resetState() {
      selected = null;
      feedback = '';
      explanation = '';
    }
  
    function nextStep() {
      resetState();
      currentStep += 1;
    }
  
    function checkAnswer() {
      const step = steps[currentStep];
      const opt = step.options?.find(o => o.value === selected);
      if (!opt) return;
      if (opt.correct) {
        feedback = '🌟 Správně!';
        score += 10;
        setTimeout(() => {
          nextStep();
        }, 1000);
      } else {
        feedback = '❌ Špatně!';
        explanation = opt.explanation || '';
      }
    }
  
    function finishQuiz() {
      onComplete();
    }
  </script>
  
  <div class="map-container">
    {#each steps as step, idx}
      <section class="map-step">
        <div class="node"></div>
        <h3 class="quiz-header">{step.header}</h3>
        {#if step.text}
          <p class="quiz-text">{step.text}</p>
        {/if}
  
        {#if step.options}
          <ul class="options">
            {#each step.options as o}
              <li>
                <label>
                  <input
                    type="radio"
                    bind:group={selected}
                    value={o.value} />
                  {o.label}
                </label>
              </li>
            {/each}
          </ul>
          <button
            class="btn"
            on:click={checkAnswer}
            disabled={!selected}>
            Ověřit
          </button>
  
          {#if feedback}
            <p class="feedback {feedback === '🌟 Správně!' ? 'success' : 'error'}">
              {feedback}
            </p>
            {#if explanation}
              <p class="explanation">{explanation}</p>
            {/if}
          {/if}
        {/if}
      </section>
    {/each}
  </div>

  <style>
    .map-container {
    height: 300px;                /* viewport height for one step */
    overflow-y: auto;             /* make it scrollable */
    scroll-snap-type: y mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .map-step {
    scroll-snap-align: start;
    min-height: 300px;            /* same as container height */
    padding: 20px;
    box-sizing: border-box;
    position: relative;
  }
   
   
    
    .node {
      width: 16px;
      height: 16px;
      background: #4a90e2;
      border-radius: 50%;
      position: absolute;
      left: 20px;
      top: 20px;
    }
    .map-step::after {
      content: '';
      position: absolute;
      left: 27px;
      top: 36px;
      width: 2px;
      height: calc(100% - 36px);
      background: #ccc;
    }
    .quiz-header { margin-top: 0; margin-left: 50px; }
    .quiz-text { margin-left: 50px; white-space: pre-line; }
    .options { list-style: none; padding: 0; margin-left: 50px; margin-bottom: 20px; }
    .options li { margin-bottom: 10px; }
    .options label { display: block; background: #f9f9f9; padding: 10px 15px; border-radius: 5px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s; }
    .options input[type="radio"] { display: none; }
    .btn { margin-left: 50px; padding: 10px 20px; background: #4a90e2; color: white; border: none; border-radius: 5px; cursor: pointer; }
    .btn:disabled { background: #aaa; cursor: default; }
    .feedback { margin-top: 10px; margin-left: 50px; font-style: italic; }
    .feedback.success { color: #2a9d8f; }
    .feedback.error { color: #e76f51; }
    .explanation { margin-top: 5px; margin-left: 50px; color: #888; font-size: 0.9rem; }
  </style>
  