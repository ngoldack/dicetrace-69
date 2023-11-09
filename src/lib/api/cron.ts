import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';

// CronRequestHandler is a RequestHandler that checks for a valid cron secret in the Authorization header.
export const CronRequestHandler = (handler: RequestHandler): RequestHandler => {
	// @ts-expect-error - Typescript doesn't like this, but it works.
	return async ({ headers, ...args }) => {
		const isCron = headers.get('Authorization') === 'Bearer ' + env.CRON_SECRET;
		if (!isCron) return new Response('Unauthorized', { status: 401 });

		// @ts-expect-error - Typescript doesn't like this, but it works.
		return handler({ headers, ...args });
	};
};
