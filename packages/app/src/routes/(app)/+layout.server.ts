import { db } from '$lib/db/client.server.js';
import { users } from '$lib/db/schemas/user.schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, parent }) => {
	const { session } = await parent();
	if (!session?.user?.id) {
		throw redirect(303, '/auth');
	}

	const user = await db.select().from(users).where(eq(users.auth_id, session.user.id)).get();
	if (!user) {
		throw redirect(303, '/hello');
	}

	return {
		session,
		user
	};
};
