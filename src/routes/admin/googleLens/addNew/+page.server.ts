import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createLensPhoto } from '$lib/db/lens';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const newPhotoSchema = z.object({
    categoryId: z.number(),
    correctAnswer: z.string().min(2, { message: 'min. 2 znaky' }),
    // one accepted answer per line
    acceptedAnswers: z.string().min(2, { message: 'zadejte alespoň jednu odpověď' }),
    Image: z.any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
});

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(newPhotoSchema));
    return { form };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const form = await superValidate(request, zod(newPhotoSchema), { allowFiles: true });
        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await createLensPhoto(
                locals.supabase,
                {
                    categoryId: form.data.categoryId,
                    correctAnswer: form.data.correctAnswer,
                    acceptedAnswers: form.data.acceptedAnswers
                        .split('\n')
                        .map((a) => a.trim())
                        .filter(Boolean)
                },
                form.data.Image
            );
            return message(form, 'Data byly uloženy! :)');
        } catch (error) {
            console.error('Error:', error);
            return fail(500, { form, message: 'Failed to save data.' });
        }
    }
};
