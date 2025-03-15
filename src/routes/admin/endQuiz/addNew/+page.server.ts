import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

const api_post_question = '/api/AssignmentQuiz/CreateQuestion';
const api_post_answer = '/api/AssignmentQuiz/CreateAnswer';

const answerSchema = z.object({
	Answer: z.string().min(5, { message: 'min. 5 znaků' }),
	correct: z.boolean(),
    questionId: z.number()
});


const newQuestionWithAnswersSchema = z.object({
	Question: z.string().min(5, { message: 'min. 5 znaků' }),
	categoryId: z.number(),
	answers: z.array(answerSchema).min(1, { message: 'At least one answer is required' })
});

export const load: PageServerLoad = async () => {
	// Initialize the composite form with the dynamic array.
	const form = await superValidate(zod(newQuestionWithAnswersSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request }: { request: Request }) => {
		// Validate the combined form data.
		const form = await superValidate(request, zod(newQuestionWithAnswersSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// First, create the question.
			const responseQuestion = await fetch(`${PUBLIC_VITE_API_ROOT}${api_post_question}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					Question: form.data.Question,
					categoryId: form.data.categoryId
				})
			});

			if (!responseQuestion.ok) {
				const errorText = await responseQuestion.text();
				console.error('API error (question):', errorText);
				return fail(500, { message: 'Failed to save question.' });
			}

			// Retrieve the new question's ID.
			const questionId = await responseQuestion.json();

			// For each answer provided, send a POST request to create the answer.
			const answerResults = await Promise.all(
				form.data.answers.map(async (ans) => {
					const res = await fetch(`${PUBLIC_VITE_API_ROOT}${api_post_answer}`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							Answer: ans.Answer,
							correct: ans.correct,
							QuestionId: questionId
						})
					});
					return res;
				})
			);

			// Check that all answer API calls succeeded.
			for (const res of answerResults) {
				if (!res.ok) {
					const errorText = await res.text();
					console.error('API error (answer):', errorText);
					return fail(500, { message: 'Failed to save one or more answers.' });
				}
			}

			return message(form, { message: 'Question and answers saved successfully.' });
		} catch (error) {
			console.error('Error processing question and answers:', error);
			return fail(500, { message: 'An error occurred.' });
		}
	}
};
