import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase, imageUrl } from '$lib/supabase';
import type { AssignmentIntroductionArticle } from '$types/interfaces';
import { unwrap, uploadImage, removeImage } from './util';

const FOLDER = 'intro-articles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArticle(row: any): AssignmentIntroductionArticle & { instructions: string; imgPath: string | null } {
	return {
		id: row.id,
		title: row.title,
		content: row.content,
		instructions: row.instructions,
		// The game templates read `Instructions`, which the old API never sent, so it has always
		// rendered empty. Kept empty to leave the game unchanged.
		Instructions: '',
		imgSrc: imageUrl(row.img_path),
		imgPath: row.img_path,
		imgae: undefined as unknown as File,
		visible: row.visible,
		categoryId: row.category_id ?? 0,
		questions: (row.intro_questions ?? []).map((q: any) => ({
			id: q.id,
			term: q.term,
			description: q.description,
			assignmentIntroductionArticleId: q.article_id
		}))
	};
}

export async function getIntroArticles(client: SupabaseClient = supabase) {
	return unwrap(await client.from('intro_articles').select('*').order('id')).map(toArticle);
}

export async function getIntroArticle(id: number, client: SupabaseClient = supabase) {
	const row = unwrap(
		await client
			.from('intro_articles')
			.select('*, intro_questions(*)')
			.eq('id', id)
			.order('id', { referencedTable: 'intro_questions' })
			.single()
	);
	return toArticle(row);
}

export interface IntroArticleInput {
	title: string;
	content: string;
	instructions: string;
	visible: boolean;
	categoryId: number;
}

function toRow(input: IntroArticleInput) {
	return {
		title: input.title,
		content: input.content,
		instructions: input.instructions,
		visible: input.visible,
		category_id: input.categoryId || null
	};
}

export async function createIntroArticle(client: SupabaseClient, input: IntroArticleInput, image: File) {
	const img_path = await uploadImage(client, FOLDER, image);
	unwrap(await client.from('intro_articles').insert({ ...toRow(input), img_path }));
}

export async function updateIntroArticle(
	client: SupabaseClient,
	id: number,
	input: IntroArticleInput,
	image: File | null
) {
	const changes: Record<string, unknown> = toRow(input);

	let oldPath: string | null = null;
	if (image) {
		oldPath = unwrap(await client.from('intro_articles').select('img_path').eq('id', id).single()).img_path;
		changes.img_path = await uploadImage(client, FOLDER, image);
	}

	unwrap(await client.from('intro_articles').update(changes).eq('id', id));
	await removeImage(client, oldPath);
}

// Questions are removed by the FK cascade.
export async function deleteIntroArticle(id: number, client: SupabaseClient = supabase) {
	const row = unwrap(await client.from('intro_articles').delete().eq('id', id).select('img_path').single());
	await removeImage(client, row.img_path);
}
