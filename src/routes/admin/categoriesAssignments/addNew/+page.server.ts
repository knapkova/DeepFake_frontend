import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
import { json } from '@sveltejs/kit';


const api_post = "/api/Admin/CategoryAssignments/Create"

const newSchema = z.object({
    categoryId: z.number(),
    orderIndex: z.number(),
    assignmentType: z.number(),
    assignmentId: z.number(),
    id: z.number()
});

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(newSchema));
    return { form };
}
export const actions: Actions = {
    ddefault: async({request, fetch}) => {
        const form = await superValidate(request, zod(newSchema), { allowFiles: true });    
        if (!form.valid) {
            return fail(400, { form });
        }
        try {
            
            const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_post}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.data),
            });
            if(!response.ok) {
                const errorText = await response.text();
                console.error('API error:', errorText);
                return fail(500, { message: 'Failed to save data.' });
            }
            return message(form, 'Data byly uloženy! :)');

        }
        catch(e){
            console.error(e);
            return fail(500, { message: 'Failed to save data.' });
        }
    }
}