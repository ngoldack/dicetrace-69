import type { RequestHandler } from '@sveltejs/kit';

// AuthenticatedRequestHandler is a RequestHandler that checks for a valid session.
export const AuthenticatedRequestHandler = (handler: RequestHandler): RequestHandler => {
	return async ({ locals, ...args }) => {
		const session = await locals.getSession();
		if (!session) return new Response('Unauthorized', { status: 401 });

		return handler({ locals, ...args });
	};
};
