import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createIntroArticle } from '$lib/db/introArticles';


const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const newAssignmentSchema = z.object({
    Title: z.string().min(5, { message: 'min. 5 znaků' }),
    Content: z.string(),
    Instructions: z.string().min(5, { message: 'min. 5 znaků' }),
    ImgSrc: z.string(),
    visible: z.boolean(),
    categoryId: z.number(),
    Image: z.any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      )
  });

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(newAssignmentSchema));
    return { form };
};

export const actions: Actions = {
    default: async({request, locals}) => {
        const form = await superValidate(request, zod(newAssignmentSchema),{ allowFiles: true });
        if (!form.valid) {
            return fail(400, { form });
        }
        try {
            await createIntroArticle(
                locals.supabase,
                {
                    title: form.data.Title,
                    content: form.data.Content,
                    instructions: form.data.Instructions,
                    visible: form.data.visible,
                    categoryId: form.data.categoryId
                },
                form.data.Image
            );
            return message(form, 'Data byly uloženy! :)');
        } catch (e) {
            console.error(e);
            return fail(500, { form, message: 'Failed to save data.' });
        }
    }
}
