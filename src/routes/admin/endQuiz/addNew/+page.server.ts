import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_VITE_API_ROOT } from '$env/static/public';

const api_post = "/api/AssignmentQuiz/CreateQuestion"

// Kompozitní schéma pro otázku a pole odpovědí
const newQuestionWithAnswersSchema = z.object({
    question:z.string().min(5, { message: 'min. 5 znaků' }),
    categoryId:z.number(),
    answer: z.string().min(15, { message: 'zadejte alespoň jednuodpověď' }).default("[]")
  });

  export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(newQuestionWithAnswersSchema));
    return { form };
  };

  export const actions: Actions = {
    default: async ({ request }: { request: Request }) => {
      // Validace odeslaného payloadu podle našeho schématu
      const form = await superValidate(request, zod(newQuestionWithAnswersSchema));
      if (!form.valid) {
        console.log('Form validation failed:', form);
        return fail(400, { form });
      }
  
      try {
        console.log('Form data:', form.data);
        // Odeslání kompletního payloadu na endpoint, který vytvoří otázku i odpovědi v jedné operaci
        const response = await fetch(`${PUBLIC_VITE_API_ROOT}${api_post}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.data)
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error:', errorText);
          return fail(500, { message: 'Failed to save data.' });
        }
        return message(form, "Data byly uloženy! :)");
  
      } catch (error) {
        console.error('Error processing question and answers:', error);
        return fail(500, { message: 'An error occurred.' });
      }
    }
  };