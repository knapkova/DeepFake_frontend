<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type { QuestionEndQuiz, answersEndQuiz } from '$types/interfaces';
    import '../../../styles/admin.css';
    import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

    const api_get = "/api/AssignmentQuiz/GetQuestions";
    const api_delete = "/api/AssignmentQuiz/DeleteQuestion/";

    let updateMessage: string = '';
    let fetchError: string = '';
    let loading = true;

    let questions = writable<QuestionEndQuiz[]>([]);

    onMount(async () => {
        try {
            const response = await fetch(PUBLIC_VITE_API_ROOT + api_get, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error(`Server vrátil ${response.status}`);
            const data = await response.json();
            data.forEach((item: QuestionEndQuiz) => {
                item.answer = JSON.parse(item.answer as unknown as string) as answersEndQuiz[];
            });
            questions.set(data);
        } catch {
            fetchError = 'Nepodařilo se načíst otázky. Zkuste stránku obnovit.';
        } finally {
            loading = false;
        }
    });

    async function deleteQuestion(id: number) {
        if (!confirm('Opravdu chcete smazat tuto otázku?')) return;

        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_delete}${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            questions.update(qs => qs.filter(q => q.id !== id));
            updateMessage = `Otázka ${id} smazána.`;
        } else {
            updateMessage = `Nepodařilo se smazat otázku ${id}.`;
        }
    }
</script>

<a href="/admin" class="back-link">Zpět na přehled</a>
<h2>Opakovací kvíz</h2>

{#if updateMessage}
    <div class="update-message">{updateMessage}</div>
{/if}

{#if loading}
    <p class="status-message">Načítání...</p>
{:else if fetchError}
    <p class="status-message error" role="alert">{fetchError}</p>
{:else}
    <button onclick={() => window.location.href = '/admin/endQuiz/addNew'}>+ Přidat nové</button>
    <table>
        <thead>
            <tr>
                <th>Kategorie</th>
                <th>Otázka</th>
                <th>Odpovědi</th>
                <th>Akce</th>
            </tr>
        </thead>
        <tbody>
            {#each $questions as question (question.id)}
                <tr>
                    <td>{question.categoryId}</td>
                    <td>{question.question}</td>
                    <td>
                        {#each question.answer as ans}
                            <div>{ans.correct ? '✅' : '❌'} {ans.answer}</div>
                        {/each}
                    </td>
                    <td>
                        <button onclick={() => deleteQuestion(question.id)}>Smazat</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}

<style>
    .status-message { padding: 1rem; }
    .status-message.error { color: #dc2626; }
</style>
