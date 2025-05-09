<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    export let onComplete: () => void = () => {};
    let hasCompleted = false;

    type Section = {
      content?: string;
      question?: string;
      options?: Options[];
    };
    type Options = {
      answer: string;
      isCorrect: boolean;
      explanation: string;
    };
  
    let sections: Section[] = [
      { content: `Někteří lidé šíří dezinformace záměrně s cílem se obohatit nebo získat moc.
  Jiní se jen nedokáží zorientovat v záplavě informací.` },
      {
        question: `Zkusím je teda nějak přesvědčit. Jak je ale nejlépe konfrontovat?`,
        options: [
          { answer: `Upozornit je, že věří konspiračním teoriím..`, isCorrect: false,
            explanation: `Nálepkování většinou nikam nevede, budeš potřebovat lepší argument.` },
          { answer: `Zesměšnit a zpochybnit důvěryhodnost Ivana.`, isCorrect: false,
            explanation: `Útokem na “šiřitele pravdy” můžeš nechtěně podpořit konspirační teorii o tajném spiknutí.` },
          { answer: `Dokázat, že Ivan prezentuje nepravdivé informace.`, isCorrect: true,
            explanation: `` }
        ]
      },
      {
        question: `Jak příspěvek nejlépe ověřit?`,
        options: [
          { answer: 'Dohledat informace o tajné misi, kterou Ivan zmiňuje.', isCorrect: false,
            explanation: `Vždycky je těžší dokázat, že něco neexistuje, než naopak...` },
          { answer: 'Ověřit, jestli nejsou vytržené z kontextu.', isCorrect: true,
            explanation: `` }
        ]
      },
      {
        question: `Tipni si, odkud Ivan získal fotky z Marsu.`,
        options: [
          { answer: `Má kontakty ve vysoké politice.`, isCorrect: true,
            explanation: `Tak pojď zjistit, jak to teda je…` },
          { answer: `Naboural se do tajných archivů NASA.`, isCorrect: true,
            explanation: `Tak pojď zjistit, jak to teda je…` },
          { answer: `Fotky vůbec nejsou z Marsu.`, isCorrect: true,
            explanation: `Ivan přidává další materiály – několik fotografií, které podle něj dokazují, že přistání na Marsu už proběhlo. Obrázky jsou velmi přesvědčivé, ale přesto by možná stálo za to se na ty fotky podívat trochu blíž. Dokážeš o nich zjistit víc?
` }
        ]
      },
      { content: `Tak pojď zjistit, jak to teda je…` }
    ];

    let selected: Array<Options | null> = Array(sections.length).fill(null);
    let feedback: string[]               = Array(sections.length).fill('');
    let currentStep = 0;

    $: canAdvance = !sections[currentStep].question || feedback[currentStep] === 'Správně!';
    
    $: if (
    !hasCompleted &&
    currentStep === sections.length - 1 &&
    canAdvance
  ) {
    hasCompleted = true;
    onComplete();
  }

  function checkAnswer(i: number) {
      const opt = selected[i]; 
      if (!opt) return;
      if (opt.isCorrect) feedback[i] = 'Správně!';
      
      else { feedback[i] = opt.explanation; selected[i] = null; }
    }

    let container: HTMLElement;

    let observer: IntersectionObserver;

    onMount(() => {
    // only do this once container is bound
    observer = new IntersectionObserver(onIntersect, {
      root: container,
      // fire as soon as any part of the section crosses the midpoint
      rootMargin: `-50% 0px -50% 0px`,
      threshold: 0
    });

    // observe all pages
    container
      .querySelectorAll<HTMLElement>('.snap-section')
      .forEach((sec, i) => {
        sec.dataset.idx = String(i);
        observer.observe(sec);
      });
  });

  onDestroy(() => {
    observer.disconnect();
  });

  function onIntersect(entries: IntersectionObserverEntry[]) {
    for (const e of entries) {
      if (e.isIntersecting) {
        const idx = Number((e.target as HTMLElement).dataset.idx);
        // allow backward or “answered” forward
        if (idx <= currentStep || canAdvance) {
          currentStep = idx;
        } else {
          // jump back if they tried skipping ahead
          container.scrollTo({ top: currentStep * container.clientHeight, behavior: 'auto' });
        }
      }
    }
  }

  function blockScroll(e: WheelEvent | TouchEvent) {
      const delta = 'deltaY' in e ? (e as WheelEvent).deltaY : 1;
      if (delta > 0 && !canAdvance) {
        e.preventDefault();
        container.scrollTo({ top: currentStep * window.innerHeight });
      }
  }
  
    
  </script>
  
  <main
    bind:this={container}
    class="scroll-container"
    on:wheel={blockScroll}
    on:touchmove={blockScroll}
  >
  <div class="page-indicator">
  </div>
    {#each sections as sec, i}

      <section class="snap-section">
        Stránka {currentStep + 1} z {sections.length} i {i}

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
            >Zkontrolovat</button>
  
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
  /* Import a clean, modern font */
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');

  :global(body) {
    margin: 0;
    background: #eceff4;
    font-family: 'Open Sans', sans-serif;
    color: #333;
  }

  .scroll-container {
    height: 75vh;
    overflow-y: auto;
    /* change to mandatory so it always snaps to one section */
    scroll-snap-type: y mandatory;
    overscroll-behavior: contain;
    scroll-behavior: auto;
    padding: 1rem 0;
    box-sizing: border-box;
    background: #eceff4;
  }

  .snap-section {
    /* force each “page” to fill the viewport */
    height: 75vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    max-width: 800px;
    margin: 1rem auto;
    padding: 2rem;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .snap-section:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
  .snap-section:nth-child(odd) {
    background: #fafafa;
  }

  .content p {
    margin-bottom: 1rem;
    line-height: 1.6;
    font-size: 1.1rem;
  }

  .quiz {
    margin-top: 2rem;
    background: #fdfdfd;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.04);
  }
  .quiz .question {
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1.15rem;
  }

  /* Custom radio + label styling */
  .quiz label {
    display: flex;
    align-items: center;
    padding: 0.6rem 1rem;
    margin-bottom: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .quiz label:hover {
    background: #f0f0f0;
    border-color: #ccc;
  }
  .quiz input[type="radio"] {
    margin-right: 0.75rem;
    accent-color: #667eea;
    width: 1.1rem;
    height: 1.1rem;
  }

 
  .quiz button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .correct, .incorrect {
    margin-top: 1rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    display: inline-block;
  }
  .correct {
    background: #daf5e4;
    color: #276749;
  }
  .incorrect {
    background: #ffe3e3;
    color: #b91c1c;
  }
</style>