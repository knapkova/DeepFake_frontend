import { fail, message } from 'sveltekit-superforms';
import { z } from 'zod';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { createQuizQuestion } from '$lib/db/quiz';


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
    default: async({request, locals})=> {
      // Validace odeslaného payloadu podle našeho schématu
      const form = await superValidate(request, zod(newQuestionWithAnswersSchema));
      if (!form.valid) {
        return fail(400, { form });
      }
      try {
        // the form sends the answers as a JSON string
        await createQuizQuestion(locals.supabase, {
          question: form.data.question,
          categoryId: form.data.categoryId,
          answers: JSON.parse(form.data.answer)
        });
        return message(form, "Data byly uloženy! :)");
      } catch (error) {
        console.error('Error processing question and answers:', error);
        return fail(500, { form, message: 'An error occurred.' });
      }
    }
  };
