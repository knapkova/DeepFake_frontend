import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase, imageUrl } from '$lib/supabase';
import type { Category } from '$types/interfaces';
import { unwrap, uploadImage, removeImage } from './util';

const FOLDER = 'categories';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCategory(row: any): Category {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		visible: row.visible,
		duration: row.duration,
		imgSrc: imageUrl(row.img_path),
		image: '',
		funFacts: (row.fun_facts ?? []).map((f: any) => ({
			id: f.id,
			title: f.title,
			text: f.text,
			categoryId: f.category_id
		})),
		feedbackMemes: (row.feedback_memes ?? []).map((m: any) => ({
			id: m.id,
			description: m.description,
			imgSrc: imageUrl(m.img_path)
		}))
	};
}

export async function getCategories(client: SupabaseClient = supabase): Promise<Category[]> {
	return unwrap(await client.from('categories').select('*').order('id')).map(toCategory);
}

export async function getActiveCategories(client: SupabaseClient = supabase): Promise<Category[]> {
	return unwrap(await client.from('categories').select('*').eq('visible', true).order('id')).map(toCategory);
}

export async function getCategoryById(id: number, client: SupabaseClient = supabase): Promise<Category> {
	const row = unwrap(
		await client
			.from('categories')
			.select('*, fun_facts(*), feedback_memes(*)')
			.eq('id', id)
			.order('id', { referencedTable: 'fun_facts' })
			.order('id', { referencedTable: 'feedback_memes' })
			.single()
	);
	return toCategory(row);
}

export interface CategoryInput {
	name: string;
	description: string;
	duration: number;
	visible: boolean;
}

export async function createCategory(client: SupabaseClient, input: CategoryInput, image: File) {
	const img_path = await uploadImage(client, FOLDER, image);
	unwrap(await client.from('categories').insert({ ...input, img_path }));
}

export async function updateCategory(
	category: CategoryInput & { id: number },
	image: File | null,
	client: SupabaseClient = supabase
) {
	const { id, name, description, duration, visible } = category;
	const changes: Record<string, unknown> = { name, description, duration, visible };

	let oldPath: string | null = null;
	if (image) {
		oldPath = unwrap(await client.from('categories').select('img_path').eq('id', id).single()).img_path;
		changes.img_path = await uploadImage(client, FOLDER, image);
	}

	unwrap(await client.from('categories').update(changes).eq('id', id));
	await removeImage(client, oldPath);
}

export async function deleteCategory(id: number, client: SupabaseClient = supabase) {
	const row = unwrap(await client.from('categories').delete().eq('id', id).select('img_path').single());
	await removeImage(client, row.img_path);
}
