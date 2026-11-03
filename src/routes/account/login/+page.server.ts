import { fail } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { toAppUser } from '$lib/supabase';

const loginScheme = z.object({
	email: z.string().email({ message: 'neplatný email' }),
	password: z.string().min(6, { message: 'min. 6 znaků' })
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(loginScheme));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(loginScheme));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { data, error } = await locals.supabase.auth.signInWithPassword(form.data);
		if (error) {
			return fail(400, { form, message: 'Nesprávný email nebo heslo' });
		}

		return { form, user: toAppUser(data.user), message: 'Login successful' };
	}
};
