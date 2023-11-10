import type { LayoutServerLoad } from './app/$types';

// @ts-expect-error - Sveltekit confused
export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	return {
		session: session
	};
};
