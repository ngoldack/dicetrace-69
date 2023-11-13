import { messageSchema } from '$lib/schemas/message';
import type { LayoutServerLoad } from './app/$types';

// @ts-expect-error - Sveltekit confused
export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	return {
		session: session,
		messages: locals.messages?.map((text: string) => messageSchema.optional().parse({ text }))
	};
};
