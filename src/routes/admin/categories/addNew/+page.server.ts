import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createCategory } from '$lib/db/categories';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const newCategorySchema = z.object({
    Name: z.string().min(5, { message: 'min. 5 znaků' }),
    Description: z.string().min(5, { message: 'min. 5 znaků' }),
    Duration: z.number().int().positive(),
    ImgSrc: z.string(),
    Image: z.any()
              .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
              .refine(
                (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
                "Only .jpg, .jpeg, .png and .webp formats are supported."
              ),
    Visible: z.boolean()
});

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(newCategorySchema));
    return { form };
}
export const actions: Actions = {
    default: async ({ request, locals }) => {
        const form = await superValidate(request, zod(newCategorySchema), { allowFiles: true });
        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await createCategory(
                locals.supabase,
                {
                    name: form.data.Name,
                    description: form.data.Description,
                    duration: form.data.Duration,
                    visible: form.data.Visible
                },
                form.data.Image
            );
            return message(form, 'Data byly uloženy! :)');
        } catch (error) {
            console.error('Error:', error);
            return fail(500, { form, message: 'Failed to save data.' });
        }
    }
}
