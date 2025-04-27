<script lang="ts">
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import type { QuestionEndQuiz, answersEndQuiz } from '$types/interfaces';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    import "../styles/quiz.css";
    export let onLevelComplete: () => void = () => {};

  function completeLevel() {
    onLevelComplete();
  }
  
    let category_id = 11;
    const api_get_by_category = "/api/AssignmentQuiz/GetQuestionsByCategoryId/";
  
    let questions = writable<QuestionEndQuiz[]>([]);
    let selectedAnswers = writable<number[]>([]);
    let state: 'start' | 'quiz' = 'start'; 
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
      state = 'start';
      quizEvaluated = false;
      score = 0;
      progress.set(0);
      // Reinitialize selectedAnswers to -1
      const qs = get(questions);
      selectedAnswers.set(qs.map(() => -1));
    }
  </script>
  
  {#if state === 'start'}
    <div class="quiz-start">
      <h2>Závěrečný kvíz</h2>
      <p>Jste připraveni zopakovat si, co jste se naučili?</p>
      <button class="start-btn" on:click={startQuiz}>Začít kvíz</button>
    </div>
  {:else if state === 'quiz'}
    <div class="quiz-container">
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
          class="evaluate-btn"
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
          <button class="restart-btn" on:click={() =>completeLevel()}>Zkusit znovu</button>
        </div>
      {/if}
    </div>
  {/if}
  