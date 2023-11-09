import { SvelteKitAuth } from '@auth/sveltekit';
import Email from '@auth/core/providers/email';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/db/conn.server';
import { env } from '$env/dynamic/private';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';

// Authentication handles the authentication process.
const authentication: Handle = SvelteKitAuth({
	adapter: DrizzleAdapter(db),
	providers: [
		Email({
			server: env.EMAIL_SERVER_URL,
			from: env.EMAIL_FROM
		})
	]
});

// Authorization checks if the user is authenticated and redirects to the signin page if not.
const authorization: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/app')) {
		const session = await event.locals.getSession();

		if (!session) {
			throw redirect(303, '/auth/signin');
		}
	}

	return resolve(event);
};

// Handle is the entry point for all hooks.
export const handle: Handle = sequence(authentication, authorization);
