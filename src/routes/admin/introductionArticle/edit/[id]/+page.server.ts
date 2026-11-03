import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { getIntroArticle, updateIntroArticle } from '$lib/db/introArticles';
import { error } from '@sveltejs/kit';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const editSchema = z.object({
    id: z.number(),
    Title: z.string().min(5, { message: 'min. 5 znaků' }),
    Content: z.string(),
    Instructions: z.string().min(5, { message: 'min. 5 znaků' }),
    ImgSrc: z.string(),
    visible: z.boolean(),
    categoryId: z.number(),
    // Image is optional on edit — only required if replacing the existing image
    Image: z.any()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, 'Max. velikost obrázku je 5MB.')
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type), 'Podporované formáty: .jpg, .jpeg, .png, .webp.')
        .optional()
});

export const load: PageServerLoad = async ({ params, locals }) => {
    let article;
    try {
        article = await getIntroArticle(Number(params.id), locals.supabase);
    } catch {
        throw error(404, 'Článek nebyl nalezen.');
    }

    const form = await superValidate(
        {
            id: article.id,
            Title: article.title ?? '',
            Content: article.content ?? '',
            Instructions: article.instructions ?? '',
            ImgSrc: article.imgSrc ?? '',
            visible: article.visible ?? false,
            categoryId: article.categoryId ?? 0
        },
        zod(editSchema)
    );

    return { form };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const form = await superValidate(request, zod(editSchema), { allowFiles: true });

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await updateIntroArticle(
                locals.supabase,
                form.data.id,
                {
                    title: form.data.Title,
                    content: form.data.Content,
                    instructions: form.data.Instructions,
                    visible: form.data.visible,
                    categoryId: form.data.categoryId
                },
                form.data.Image || null
            );
            return message(form, 'Změny byly uloženy.');
        } catch (e) {
            console.error(e);
            return fail(500, { form, message: 'Nepodařilo se uložit změny.' });
        }
    }
};
