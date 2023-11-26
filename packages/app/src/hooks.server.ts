import { env } from '$env/dynamic/private';
import { DrizzleAdapter } from '$lib/auth/adapter.server';
import { runMigrations } from '$lib/db/migration.server';
import logger from '$lib/logger';
import Passage from '@auth/core/providers/passage';
import { SvelteKitAuth } from '@auth/sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { match } from 'ts-pattern';

await runMigrations();

const authLogger = logger.child({ name: 'auth' });

// Authenticate checks if the user is authenticated and sets the session if so.
const authenticate: Handle = SvelteKitAuth({
	adapter: DrizzleAdapter(),
	providers: [
		Passage({
			issuer: env.PASSAGE_ISSUER,
			clientId: env.PASSAGE_CLIENT_ID,
			clientSecret: env.PASSAGE_CLIENT_SECRET
		})
	],
	callbacks: {
		session: async ({ session, user }) => {
			return {
				...session,
				user: {
					...user
				}
			};
		}
	},
	logger: {
		debug: (message, metadata) => authLogger.trace({ metadata }, message),
		error: (error) => authLogger.error({ error }, `${error.name}: ${error.message}`),
		warn: (code) =>
			match(code)
				.with('csrf-disabled', () => authLogger.warn('CSRF is disabled.'))
				.with('debug-enabled', () => authLogger.warn('Debug is enabled.'))
				.exhaustive()
	}
});

// Authorization checks if the user is authenticated and redirects to the signin page if not.
const authorization: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/app')) {
		const session = await event.locals.getSession();
		if (!session) throw redirect(303, '/auth');
	}

	return resolve(event);
};

// Handle is the entry point for all hooks.
export const handle: Handle = sequence(authenticate, authorization);
