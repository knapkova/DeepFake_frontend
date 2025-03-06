import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from '../$types';
import { zod } from 'sveltekit-superforms/adapters';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const api_post = "/api/Admin/AssignmentFindPictureSource/Create"
const newAssignmentSchema = z.object({
    ImgTitle:z.string().min(5,{message:'min. 5 znaků'}),
    ImgDescription:z.string().min(5,{message:'min. 5 znaků'}),
    ImgSrc: z.string(),
    ImgAlt:z.string().min(5,{message:'min. 5 znaků'}),
        Image: z.any()
          .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
          )
})

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(newAssignmentSchema));
    return { form };
}

export const actions: Actions = {
    default: async ({ request }) => {
    const form = await superValidate(request, zod(newAssignmentSchema),{ allowFiles: true });
    
    if (!form.valid) {
        return fail(400, { form });
    }

    try {
        const formData = new FormData();
        formData.append('ImgTitle', form.data.ImgTitle);
        formData.append('ImgDescription', form.data.ImgDescription);
        formData.append('ImgSrc', 'non-empty');
        formData.append('ImgAlt', form.data.ImgAlt);
        formData.append('Image', form.data.Image);
        console.log(formData);

        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_post}`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error:', errorText);
            return fail(500, { message: 'Failed to save data.' });
        }
        else{
            return message(form, 'Data byly uloženy! :)');
        }
    } catch (error) {
        console.error('Error:', error);
        return fail(500, { message: 'Failed to save data'});
        }
}};