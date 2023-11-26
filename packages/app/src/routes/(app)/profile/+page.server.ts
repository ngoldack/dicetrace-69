import { db } from '$lib/db/client.server';
import { collection } from '$lib/db/schemas/collection.schema';
import { collectionItem } from '$lib/db/schemas/collectionItem.schema';
import { insertUserSchema, users as userTable } from '$lib/db/schemas/user.schema';
import { fail, type Actions } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms/server';

export const load = async ({ parent }) => {
	const { user, session } = await parent();
	const form = await superValidate(user, insertUserSchema);

	const [{ collectionSize }] = await db
		.select({ collectionSize: sql`count(*)` })
		.from(collectionItem)
		.innerJoin(collection, eq(collection.id, collectionItem.collectionId))
		.where(eq(collection.userId, user.id));

	return {
		collectionSize,
		user,
		session,
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, insertUserSchema);

		const session = await locals.getSession();
		if (!session?.user?.email) {
			return message(form, 'You must be logged in to edit your profile.', {
				status: 401
			});
		}

		if (!form.valid) {
			return fail(400, { form });
		}
		// Email is not editable
		form.data.email = session.user.email;

		const resp = await db
			.update(userTable)
			.set({
				name: form.data.name,
				bgg_username: form.data.bgg_username,
				avatar: form.data.avatar,
				updatedAt: new Date(Date.now())
			})
			.where(eq(userTable.email, session.user.email));
		if (resp.rowsAffected === 0) {
			return message(form, 'User not found.', {
				status: 404
			});
		}

		return {
			form
		};
	}
};
