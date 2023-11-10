import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// @ts-expect-error - Sveltekit confused
export const load: LayoutServerLoad = async ({ locals, parent }) => {
	const { session } = await parent();
	if (!session) {
		throw redirect(303, '/auth');
	}
	return {
		session,
		user: locals.user
	};
};
