import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase, imageUrl } from '$lib/supabase';
import type { AssignmentFindPictureSource } from '$types/interfaces';
import { unwrap, uploadImage, removeImage } from './util';

const FOLDER = 'google-lens';

export interface LensPhoto extends AssignmentFindPictureSource {
	acceptedAnswers: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPhoto(row: any): LensPhoto {
	return {
		id: row.id,
		imgSrc: imageUrl(row.img_path),
		categoryId: row.category_id,
		correctAnswer: row.correct_answer,
		image: '',
		// Only staff can read accepted answers (RLS); players always get [].
		acceptedAnswers: (row.lens_accepted_answers ?? []).map((a: { answer: string }) => a.answer)
	};
}

export async function getLensPhotosByCategory(categoryId: number, client: SupabaseClient = supabase) {
	return unwrap(
		await client.from('lens_photos').select('*').eq('category_id', categoryId).order('id')
	).map(toPhoto);
}

// Answers are checked in the database so the accepted list never reaches the browser.
export async function checkLensAnswer(photoId: number, answer: string, client: SupabaseClient = supabase) {
	return unwrap(await client.rpc('check_lens_answer', { photo_id: photoId, answer })) as boolean;
}

// Admin

export async function getLensPhotosWithAnswers(client: SupabaseClient = supabase) {
	return unwrap(
		await client
			.from('lens_photos')
			.select('*, lens_accepted_answers(answer)')
			.order('id')
			.order('id', { referencedTable: 'lens_accepted_answers' })
	).map(toPhoto);
}

export async function createLensPhoto(
	client: SupabaseClient,
	input: { categoryId: number; correctAnswer: string; acceptedAnswers: string[] },
	image: File
) {
	const img_path = await uploadImage(client, FOLDER, image);
	const photo = unwrap(
		await client
			.from('lens_photos')
			.insert({ category_id: input.categoryId, correct_answer: input.correctAnswer, img_path })
			.select('id')
			.single()
	);
	if (input.acceptedAnswers.length) {
		unwrap(
			await client
				.from('lens_accepted_answers')
				.insert(input.acceptedAnswers.map((answer) => ({ photo_id: photo.id, answer })))
		);
	}
}

// Accepted answers are removed by the FK cascade.
export async function deleteLensPhoto(id: number, client: SupabaseClient = supabase) {
	const row = unwrap(await client.from('lens_photos').delete().eq('id', id).select('img_path').single());
	await removeImage(client, row.img_path);
}
