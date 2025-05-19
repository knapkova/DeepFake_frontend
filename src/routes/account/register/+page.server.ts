import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';


const api_register = "/api/Security/Account/Register"


const registerScheme = z
  .object({
    username: z.string().min(3, { message: 'min. 3 znaky' }),
    email: z.string().email({ message: 'neplatný email' }),
	password: z
	.string()
	.min(6, { message: 'min. 6 znaků' })
	.refine(val => /[^A-Za-z0-9]/.test(val), {
	  message: 'alespoň jeden speciální znak'
	})
	.refine(val => /\d/.test(val), {
	  message: "alespoň jedno číslo ('0'-'9')."
	})
	.refine(val => /[A-Z]/.test(val), {
	  message: "alespoň jedno velké písmeno ('A'-'Z')."
	})  
	.refine(val => /[a-z]/.test(val), {
		message: "alespoň jedno malé písmeno ('a'-'z')."
	  }),    
	  repeatedPassword: z.string()
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeatedPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Hesla se neshodují',
        path: ['repeatedPassword']
      });
    }
  });

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(registerScheme));
    return { form };
}

export const actions: Actions = {
	default: async ({ request }: { request: Request }) => {
		const form = await superValidate(request, zod(registerScheme));
		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_register}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form.data)
			});
			if (!response.ok) {
				let errorData: { message?: string; errors?: string[] } = {};
				try {
					errorData = await response.json();
				} catch (e) {
					errorData.message = await response.text();
				}
				console.log('Error response:', errorData);
				if (errorData.message === "Username is already in use.") {
					form.errors.username = [errorData.message];
				} else if (errorData.message === "Email is already in use.") {
					form.errors.email = [errorData.message];
				} else if (errorData.errors && Array.isArray(errorData.errors)) {
					errorData.errors.forEach(err => {
						if (err.includes("Username")) {
							form.errors.username = [err];
						}
						if (err.includes("Email")) {
							form.errors.email = [err];
						}
					});
				}
				return fail(response.status, { form });
			}

            console.log('Success response:', response);
            return message(form, "Registrace proběhla úspěšně! :)");

        		} 
			catch (e) {
				console.error(e);
				return fail(500, { form });
		}
	}
}
