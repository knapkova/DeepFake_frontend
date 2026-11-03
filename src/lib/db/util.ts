import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { IMAGES_BUCKET } from '$lib/supabase';

// Throws the Supabase error so callers can use plain try/catch.
export function unwrap<R extends { data: unknown; error: PostgrestError | null }>(
	response: R
): NonNullable<R['data']> {
	if (response.error) throw response.error;
	return response.data as NonNullable<R['data']>;
}

// Uploads an image into the public bucket and returns its object path.
export async function uploadImage(client: SupabaseClient, folder: string, file: File): Promise<string> {
	const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
	const path = `${folder}/${crypto.randomUUID()}.${ext}`;
	const { error } = await client.storage.from(IMAGES_BUCKET).upload(path, file, { contentType: file.type });
	if (error) throw error;
	return path;
}

export async function removeImage(client: SupabaseClient, path: string | null | undefined) {
	if (!path) return;
	const { error } = await client.storage.from(IMAGES_BUCKET).remove([path]);
	if (error) console.error('Failed to remove image', path, error);
}
