import { supabase } from '$lib/supabase';
import type { Feedback } from '$types/interfaces';
import { unwrap } from './util';

// Players can insert feedback but never read it back (RLS), so no .select() here.
export async function createFeedback(feedback: Feedback) {
	unwrap(
		await supabase.from('feedback').insert({
			type_of_user: feedback.typeOfUser,
			name: feedback.name,
			age: feedback.age,
			email: feedback.email,
			gender: feedback.gender,
			newsletter_approved: feedback.newsletterApproved,
			stars: feedback.stars,
			feedback_further: feedback.feedbackFurther
		})
	);
}
