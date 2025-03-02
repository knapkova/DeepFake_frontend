import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';


const api_post = "/api/Admin/AssignmentManipulativeText/CreateAssignmentManipulativeText";
const api_get = "/api/Admin/AssignmentManipulativeText/GetAssignmentManipulativeTexts";
const newAssignmentSchema = z.object({
	header: z.string().min(5, { message: 'Povinné pole' }),
	text: z.string().min(20, { message: 'min. 20 znaků' }),
	manipulativeParts: z.string().default("[]")
});

export const load: PageServerLoad = async (event) => {
    const form = await superValidate(zod(newAssignmentSchema));
	return { form };
};


export const actions: Actions = {
    default: async({request})=>{
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
            console.log(JSON.stringify(form.data));
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
