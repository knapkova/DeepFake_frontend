import { createBrowserClient } from '@supabase/ssr';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Browser client. It reads the auth cookies set by the server client in hooks.server.ts,
// so admin pages calling it from onMount act as the logged-in staff member.
export const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const IMAGES_BUCKET = 'images';

// Public URL of an object in the `images` bucket.
export function imageUrl(path: string | null | undefined): string {
	if (!path) return '';
	return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGES_BUCKET}/${path}`;
}

export const STAFF_ROLES = ['admin', 'editor'];

export interface AppUser {
	userName: string;
	email: string;
	role: string;
}

// Shape kept from the old backend's GetUser so the `user` store and Sidebar don't change.
export function toAppUser(user: SupabaseUser | null): AppUser | null {
	if (!user) return null;
	return {
		userName: user.email?.split('@')[0] ?? '',
		email: user.email ?? '',
		role: (user.app_metadata?.role as string | undefined) ?? ''
	};
}
