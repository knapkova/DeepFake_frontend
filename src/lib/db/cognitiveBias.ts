import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase';
import type { AssignmentCognitiveBias } from '$types/interfaces';
import { unwrap } from './util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBias(row: any): AssignmentCognitiveBias {
	return {
		id: row.id,
		cognitiveBias: row.cognitive_bias,
		definition: row.definition,
		example: row.example,
		visible: row.visible,
		categoryId: row.category_id
	};
}

function toRow(bias: Omit<AssignmentCognitiveBias, 'id'>) {
	return {
		cognitive_bias: bias.cognitiveBias,
		definition: bias.definition,
		example: bias.example,
		visible: bias.visible,
		category_id: bias.categoryId
	};
}

export async function getCognitiveBiases(client: SupabaseClient = supabase) {
	return unwrap(await client.from('cognitive_biases').select('*').order('id')).map(toBias);
}

export async function getCognitiveBiasesByCategory(categoryId: number, client: SupabaseClient = supabase) {
	return unwrap(
		await client.from('cognitive_biases').select('*').eq('category_id', categoryId).order('id')
	).map(toBias);
}

export async function createCognitiveBias(client: SupabaseClient, bias: Omit<AssignmentCognitiveBias, 'id'>) {
	unwrap(await client.from('cognitive_biases').insert(toRow(bias)));
}

export async function updateCognitiveBias(bias: AssignmentCognitiveBias, client: SupabaseClient = supabase) {
	unwrap(await client.from('cognitive_biases').update(toRow(bias)).eq('id', bias.id));
}

export async function deleteCognitiveBias(id: number, client: SupabaseClient = supabase) {
	unwrap(await client.from('cognitive_biases').delete().eq('id', id));
}
