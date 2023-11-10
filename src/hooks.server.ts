import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import { SvelteKitAuth } from '@auth/sveltekit';
import { env } from '$env/dynamic/private';
import Passage from '@auth/core/providers/passage';
import { db } from '$lib/db/client.server';
import { selectUserSchema, user as userTable } from '$lib/db/schemas/user.schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

// Authenticate checks if the user is authenticated and sets the session if so.
const authenticate: Handle = SvelteKitAuth({
	providers: [
		Passage({
			issuer: env.PASSAGE_ISSUER,
			clientId: env.PASSAGE_CLIENT_ID,
			clientSecret: env.PASSAGE_CLIENT_SECRET
		})
	]
});

// Authorization checks if the user is authenticated and redirects to the signin page if not.
const authorization: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/app')) {
		const session = await event.locals.getSession();
		if (!session) throw redirect(303, '/auth');
	}

	return await resolve(event);
};

// userdata gets the user data from the database and sets it on the locals.
// If the user does not exist in the database, it is created.
const userdata: Handle = async ({ event, resolve }) => {
	const session = await event.locals.getSession();
	if (!session?.user?.email) {
		return await resolve(event);
	}

	const users = await db.select().from(userTable).where(eq(userTable.email, session.user.email));
	switch (users.length) {
		case 0: {
			const parsed = createInsertSchema(userTable).parse({
				email: session.user.email
			});
			await db.insert(userTable).values(parsed);

			return await userdata({ event, resolve });
		}
		case 1: {
			event.locals.user = selectUserSchema.parse(users[0]);
			break;
		}
		default: {
			throw new Error('Multiple users found with the same email address.');
		}
	}
	return await resolve(event);
};

// Handle is the entry point for all hooks.
export const handle: Handle = sequence(authenticate, authorization, userdata);
