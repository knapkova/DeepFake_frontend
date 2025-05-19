<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type {QuestionEndQuiz,answersEndQuiz} from '$types/interfaces';
    import '../../../styles/admin.css';
	import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
    
    
    function navigate(){
    window.location.href = "/admin/endQuiz/addNew";
}

const api_get = "/api/AssignmentQuiz/GetQuestions"
const api_delete = "/api/AssignmentQuiz/DeleteQuestion/"

let updateMessage: string = '';

let questions = writable<QuestionEndQuiz[]>([]);
    onMount(async () => {
        const response = await fetch(PUBLIC_VITE_API_ROOT + api_get);
        const data = await response.json();
        data.forEach((item: QuestionEndQuiz) => {
            item.answer = JSON.parse(item.answer as unknown as string) as answersEndQuiz[];
        });
        questions.set(data);
    });
    console.log(questions)


async function deleteQuestion(id: number) {
    const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_delete}${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        questions.update(texts => texts.filter(text => text.id !== id));
    } else {
        console.error('Failed to delete text');
    }
}


</script>

<a href="/admin" class="back-link">Zpět na přehled</a>
<h2>Opakovací kvíz</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

<button onclick={navigate}>+ Přidat nové</button>

<table>
    <thead>
        <tr>
            <th>Kategorie</th>
            <th>Otázka</th>
            <th>Odpovědi</th>
        </tr>
    </thead>
    <tbody>
        {#each $questions as question}
          <tr>
            <td>{question.categoryId}</td>
            <td>{question.question}</td>
            <td>
              {#each question.answer as ans}
                <div>{ans.correct ? '✅' : '❌'} {ans.answer} </div>
              {/each}
            </td>
          </tr>
        {/each}
      </tbody>
</table>
