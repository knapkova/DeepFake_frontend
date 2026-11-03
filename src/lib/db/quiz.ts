import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase';
import type { QuestionEndQuiz, answersEndQuiz } from '$types/interfaces';
import { unwrap } from './util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toQuestion(row: any): QuestionEndQuiz {
	return {
		id: row.id,
		question: row.question,
		categoryId: row.category_id,
		answer: row.answers
	};
}

export async function getQuizQuestions(client: SupabaseClient = supabase) {
	return unwrap(await client.from('quiz_questions').select('*').order('id')).map(toQuestion);
}

export async function getQuizQuestionsByCategory(categoryId: number, client: SupabaseClient = supabase) {
	return unwrap(
		await client.from('quiz_questions').select('*').eq('category_id', categoryId).order('id')
	).map(toQuestion);
}

export async function createQuizQuestion(
	client: SupabaseClient,
	input: { question: string; categoryId: number; answers: answersEndQuiz[] }
) {
	unwrap(
		await client.from('quiz_questions').insert({
			question: input.question,
			category_id: input.categoryId,
			answers: input.answers
		})
	);
}

export async function deleteQuizQuestion(id: number, client: SupabaseClient = supabase) {
	unwrap(await client.from('quiz_questions').delete().eq('id', id));
}
