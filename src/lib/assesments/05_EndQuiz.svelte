<script lang="ts">
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import type { QuestionEndQuiz, answersEndQuiz } from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    export let onLevelComplete: () => void = () => {};

  function completeLevel() {
    onLevelComplete();
  }
  
    let category_id = 11;
    const api_get_by_category = "/api/AssignmentQuiz/GetQuestionsByCategoryId/";
  
    let questions = writable<QuestionEndQuiz[]>([]);
    let selectedAnswers = writable<number[]>([]);
    let state: 'quiz'; 
    let quizEvaluated = false; 
    let score = 0;
    let progress = writable(0);
  
    onMount(async () => {
      const response = await fetch(PUBLIC_VITE_API_ROOT + api_get_by_category + category_id);
      const data = await response.json();
  
      // If the API returns a single object, wrap it in an array
      const questionsData: QuestionEndQuiz[] = Array.isArray(data) ? data : [data];
  
      // Parse JSON answers for each question
      questionsData.forEach((item: QuestionEndQuiz) => {
        item.answer = JSON.parse(item.answer as unknown as string) as answersEndQuiz[];
      });
      questions.set(questionsData);
  
      // Initialize selectedAnswers to -1 for each question
      selectedAnswers.set(questionsData.map(() => -1));
      startQuiz();
    });
  
    function startQuiz() {
      state = 'quiz';
      quizEvaluated = false;
      progress.set(0);
    }
  
    // Update progress whenever a radio button is changed
    function updateProgress() {
      const sel = get(selectedAnswers);
      const answeredCount = sel.filter(answer => answer !== -1).length;
      const totalQuestions = get(questions).length;
      progress.set((answeredCount / totalQuestions) * 100);
    }
  
    // Evaluate the quiz in-place (no separate "result" state)
    function evaluateQuiz() {
      quizEvaluated = true;
  
      const qs = get(questions);
      const sel = get(selectedAnswers);
      let s = 0;
      qs.forEach((question, index) => {
        if (sel[index] !== -1 && question.answer[sel[index]].correct) {
          s++;
        }
      });
      score = s;
    }
  
    // Restart the quiz from the start screen
    function restartQuiz() {
      quizEvaluated = false;
      score = 0;
      progress.set(0);
      // Reinitialize selectedAnswers to -1
      const qs = get(questions);
      selectedAnswers.set(qs.map(() => -1));
    }
  </script>
  
  {#if state === 'quiz'}
    
    <div class="quiz-container">

      <h2>Závěrečný kvíz</h2>
      <p>Jste připraveni zopakovat si, co jste se naučili?</p>
      <!-- Progress bar -->
      <div class="progress-bar">
        <div class="progress" style="width: {$progress}%"></div>
      </div>

  
      <!-- Questions and answers -->
      {#each $questions as question, qIndex (question.id)}
        <div class="question-card">
          <h4 class="question-text">{question.question}</h4>
          <ul class="answer-list">
            {#each question.answer as ans, aIndex}
              <li
                class="answer-item
                  {quizEvaluated
                    ? ans.correct
                      ? 'correct-answer'
                      : ($selectedAnswers[qIndex] === aIndex
                          ? 'wrong-answer'
                          : '')
                    : ''}"
              >
                <input
                  type="radio"
                  name={"question-" + question.id}
                  id={"q" + question.id + "-a" + aIndex}
                  on:change={() => {
                    selectedAnswers.update(arr => {
                      arr[qIndex] = aIndex;
                      return arr;
                    });
                    updateProgress();
                  }}
                  checked={$selectedAnswers[qIndex] === aIndex}
                  disabled={quizEvaluated}
                />
                <label for={"q" + question.id + "-a" + aIndex}>
                  {ans.answer}
                </label>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
  
      {#if !quizEvaluated}
        <!-- Evaluate button is disabled unless all questions answered -->
        <button
          
          on:click={evaluateQuiz}
          disabled={$progress < 100}
        >
          Vyhodnotit
        </button>
      {:else}
        <div class="quiz-result">
          <h2>Výsledek</h2>
          <p>
            Dosáhli jste <strong>{score}</strong> bodů z <strong>{$questions.length}</strong>.
          </p>
          <button on:click={() =>completeLevel()}>Dokončit </button>
        </div>
      {/if}
    </div>
  {/if}

  <style>
  /* Quiz container */
  .quiz-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  .quiz-container h2 {
    text-align: center;
    color: #333;
    margin-bottom: 0.5rem;
  }
  .quiz-container p {
    text-align: center;
    color: #555;
    margin-bottom: 1.5rem;
  }

  /* Progress bar */
  .progress-bar {
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }
  .progress {
    height: 100%;
    background: linear-gradient(90deg, #4f46e5, #3b82f6);
    transition: width 0.3s ease;
  }

  /* Questions */
  .question-card {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
  .question-text {
    margin-bottom: 1rem;
    font-weight: 600;
    color: #111827;
  }

  /* Answers */
  .answer-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .answer-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .answer-item:not(.correct-answer):not(.wrong-answer):hover {
    background: #f3f4f6;
  }
  .answer-item.correct-answer {
    background: #d1fae5;
    border: 1px solid #10b981;
  }
  .answer-item.wrong-answer {
    background: #fee2e2;
    border: 1px solid #ef4444;
    opacity: 0.8;
  }
  .answer-item input {
    accent-color: #3b82f6;
    cursor: pointer;
  }



  /* Result screen */
  .quiz-result {
    text-align: center;
    margin-top: 2rem;
  }
  .quiz-result h2 {
    color: #10b981;
    margin-bottom: 0.5rem;
  }
</style>
  