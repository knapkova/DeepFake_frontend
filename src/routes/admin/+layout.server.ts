import { redirect } from '@sveltejs/kit';
import { STAFF_ROLES } from '$lib/supabase';
import type { LayoutServerLoad } from './$types';

// UX guard only; the database enforces the same rule through RLS (public.is_editor()).
export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(302, '/account/login');
	}

	if (!STAFF_ROLES.includes(user.app_metadata?.role)) {
		throw redirect(302, '/');
	}

	return {};
};
