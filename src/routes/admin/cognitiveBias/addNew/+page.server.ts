import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createCognitiveBias } from '$lib/db/cognitiveBias';


const newAssignmentSchema = z.object({
    Visible: z.boolean(),
    CategoryId: z.number(),
    Definition: z.string().min(20, { message: 'min. 20 znaků' }),
    Example: z.string().min(20, { message: 'min. 20 znaků' }),
    CognitiveBias: z.string().min(5, { message: 'min. 5 znaků' }),
});

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(newAssignmentSchema));
    return { form };
};

export const actions: Actions = {
    default: async({request, locals})=>{
        const form = await superValidate(request, zod(newAssignmentSchema));
        if (!form.valid) {
            return fail(400,{form});
        }
        try{
            await createCognitiveBias(locals.supabase, {
                cognitiveBias: form.data.CognitiveBias,
                definition: form.data.Definition,
                example: form.data.Example,
                visible: form.data.Visible,
                categoryId: form.data.CategoryId
            });
            return message(form, "Data byly uloženy! :)");
        }catch(e){
            console.error(e);
            return fail(500, { form, message: 'Failed to save data.' });
        }
    }
}
