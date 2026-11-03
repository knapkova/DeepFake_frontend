import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createManipulativeText } from '$lib/db/manipulativeText';


const newAssignmentSchema = z.object({
	header: z.string().min(5, { message: 'min. 5 znaků' }),
	text: z.string().min(20, { message: 'min. 20 znaků' }),
	visible: z.boolean(),
    categoryId: z.number(),
    manipulativeParts: z.string().min(5, { message: 'zadejte alespoň jednu manipulativní část' }).default("[]")
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
            // `header` has no column; the game shows `instructions` above the comments.
            await createManipulativeText(locals.supabase, {
                instructions: form.data.text,
                visible: form.data.visible,
                categoryId: form.data.categoryId,
                manipulativeParts: JSON.parse(form.data.manipulativeParts)
            });
            return message(form, "Data byly uloženy! :)");
        }catch(e){
            console.error(e);
            return fail(500, { form, message: 'Failed to save data.' });
        }
    }
}
