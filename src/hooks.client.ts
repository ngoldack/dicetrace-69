import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { errorSchema } from '$lib/schemas/error';
import type { HandleClientError } from '@sveltejs/kit';
import { H } from 'highlight.run';
import { version } from 'vite';
import { createId } from '@paralleldrive/cuid2';

H.init(env.PUBLIC_HIGHLIGHT_PROJECT_ID, {
	environment: dev ? 'development' : 'production',
	version: version,
	serviceName: 'dicetrace',
	storageMode: 'sessionStorage',
	manualStart: false,
	tracingOrigins: true,
	networkRecording: {
		enabled: true,
		recordHeadersAndBody: true
	}
});

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
