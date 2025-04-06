import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

const api_post = "/api/Admin/AssignmentCognitiveBias/CreateAssignmentCognitiveBias";

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
    default: async({request, fetch})=>{
        const form = await superValidate(request, zod(newAssignmentSchema));
        console.log(form);

        if (!form.valid) {
            return fail(400,{form});
        }
        try{

        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_post}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.data),
            });
            console.log("Response from server:");
            console.log(response);
        
            if (!response.ok) {
                return fail(500, { message: 'Failed to save data.' });
            }

            return message(form, "Data byly uloženy! :)");
        }catch(e){
            console.error(e);
            return fail(500, { message: 'Failed to save data.' });
        }
    }
}