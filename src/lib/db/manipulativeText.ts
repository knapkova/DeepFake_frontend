import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase';
import type { AssignmentManipulativeText } from '$types/interfaces';
import { unwrap } from './util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toText(row: any): AssignmentManipulativeText {
	return {
		id: row.id,
		instructions: row.instructions,
		assignmentIntroductionArticleId: row.intro_article_id,
		assignmentIntroductionArticle: undefined as unknown as AssignmentManipulativeText['assignmentIntroductionArticle'],
		text: row.instructions, // shown in the admin table
		header: '',
		manipulativeParts: row.manipulative_parts,
		userFeedback: row.user_feedback,
		visible: row.visible,
		categoryId: row.category_id ?? 0,
		manipulativeComments: (row.manipulative_comments ?? []).map((c: any) => ({
			id: c.id,
			comment: c.comment,
			username: c.username,
			manipulativeMotivationId: c.motivation_id,
			manipulativeExplanation: c.explanation,
			manipulativeTextId: c.text_id
		})),
		// The game's correct answers refer to motivation positions, so keep them ordered by id.
		manipulativeMotivations: (row.manipulative_motivations ?? []).map((m: any) => ({
			id: m.id,
			motivation: m.motivation,
			definition: m.definition,
			manipulativeTextId: m.text_id
		}))
	};
}

export async function getManipulativeTexts(client: SupabaseClient = supabase) {
	return unwrap(await client.from('manipulative_texts').select('*').order('id')).map(toText);
}

export async function getManipulativeText(id: number, client: SupabaseClient = supabase) {
	const row = unwrap(
		await client
			.from('manipulative_texts')
			.select('*, manipulative_comments(*), manipulative_motivations(*)')
			.eq('id', id)
			.order('id', { referencedTable: 'manipulative_comments' })
			.order('id', { referencedTable: 'manipulative_motivations' })
			.single()
	);
	return toText(row);
}

export interface ManipulativeTextInput {
	instructions: string;
	visible: boolean;
	categoryId: number;
	manipulativeParts: unknown;
}

export async function createManipulativeText(client: SupabaseClient, input: ManipulativeTextInput) {
	unwrap(
		await client.from('manipulative_texts').insert({
			instructions: input.instructions,
			visible: input.visible,
			category_id: input.categoryId || null,
			manipulative_parts: input.manipulativeParts
		})
	);
}

export async function deleteManipulativeText(id: number, client: SupabaseClient = supabase) {
	unwrap(await client.from('manipulative_texts').delete().eq('id', id));
}
