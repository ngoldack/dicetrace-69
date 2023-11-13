import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle, error } from '@sveltejs/kit';
import { SvelteKitAuth } from '@auth/sveltekit';
import { env } from '$env/dynamic/private';
import Passage from '@auth/core/providers/passage';
import { db } from '$lib/db/client.server';
import { insertUserSchema, selectUserSchema, user as userTable, type InsertUser } from '$lib/db/schemas/user.schema';
import { eq, or } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// Authenticate checks if the user is authenticated and sets the session if so.
const authenticate: Handle = SvelteKitAuth({
	providers: [
		Passage({
			issuer: env.PASSAGE_ISSUER,
			clientId: env.PASSAGE_CLIENT_ID,
			clientSecret: env.PASSAGE_CLIENT_SECRET
		})
	],
	callbacks: {
		signIn: async ({profile}) => {
			if(profile?.email && profile?.sub) {
				const users = await db.select().from(userTable).where(
					or(eq(userTable.auth_id, profile.sub), eq(userTable.email, profile.email)
				));
				if(users.length === 0) {
					const id = createId();
					console.time('user creation')
					const parsed: InsertUser = insertUserSchema.parse({
						id: id,
						auth_id: profile?.sub,
						email: profile?.email,
						updatedAt: new Date(Date.now()),
						createdAt: new Date(Date.now()),
						avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${id}`
					});
					console.timeLog('user creation', parsed)
					await db.insert(userTable).values(parsed)
					console.timeEnd('user creation')
				}
			}

			return true
		},
	}
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
			throw error(500, {
				id: createId(),
				message: 'User not found in database.',				
			});
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

// messages strips all message query parameters from the url.
const messages: Handle = async ({ event, resolve }) => {
	if (event.url.searchParams.has('message')) {
		const messages = event.url.searchParams.getAll('message');
		event.locals.messages = messages;
		event.url.searchParams.delete('message');
	}

	return await resolve(event);
};

// Handle is the entry point for all hooks.
export const handle: Handle = sequence(authenticate, authorization, userdata, messages);
