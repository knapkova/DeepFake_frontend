import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';
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

export const load: PageServerLoad = async ({ params, fetch }) => {
    const res = await fetch(
        `${PUBLIC_VITE_API_ROOT}/api/Admin/AssignmentIntroductionArticle/Get/${params.id}`,
        { credentials: 'include' }
    );

    if (!res.ok) {
        throw error(404, 'Článek nebyl nalezen.');
    }

    const article = await res.json();

    const form = await superValidate(
        {
            id: article.id,
            Title: article.title ?? '',
            Content: article.content ?? '',
            Instructions: article.Instructions ?? '',
            ImgSrc: article.imgSrc ?? '',
            visible: article.visible ?? false,
            categoryId: article.categoryId ?? 0
        },
        zod(editSchema)
    );

    return { form };
};

export const actions: Actions = {
    default: async ({ request, fetch }) => {
        const form = await superValidate(request, zod(editSchema), { allowFiles: true });

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const formData = new FormData();
            formData.append('Id', form.data.id.toString());
            formData.append('Title', form.data.Title);
            formData.append('Content', form.data.Content);
            formData.append('Instructions', form.data.Instructions);
            formData.append('ImgSrc', form.data.ImgSrc || 'non-empty');
            formData.append('Visible', form.data.visible.toString());
            formData.append('CategoryId', form.data.categoryId.toString());
            if (form.data.Image) {
                formData.append('Image', form.data.Image);
            }

            const response = await fetch(
                `${PUBLIC_VITE_API_ROOT}/api/Admin/AssignmentIntroductionArticle/Update`,
                { method: 'POST', body: formData, credentials: 'include' }
            );

            if (!response.ok) {
                return fail(500, { form, message: 'Nepodařilo se uložit změny.' });
            }

            return message(form, 'Změny byly uloženy.');
        } catch (e) {
            console.error(e);
            return fail(500, { form, message: 'Nepodařilo se uložit změny.' });
        }
    }
};
