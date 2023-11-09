import { errorSchema } from '$lib/schemas/error';
import type { HandleClientError } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';

export const handle: HandleClientError = async ({ error }) => {
	const parsed = errorSchema.safeParse(error);
	if (parsed.success) {
		return parsed.data;
	}

	const unhandledError: App.Error = {
		id: createId(),
		message: 'Unexpected Error',
		detail: 'An unexpected error occurred. Please try again later.',
		stack: error
	};
	return unhandledError;
};
