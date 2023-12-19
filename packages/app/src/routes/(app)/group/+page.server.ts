import { db } from '$lib/db/client.server';
import {
	GroupMemberRole,
	groupInsertSchema,
	groupMembers,
	groups
} from '$lib/db/schemas/group.schema';
import { users } from '$lib/db/schemas/user.schema.js';
import logger from '$lib/logger';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms/server';

export const load = async ({ parent }) => {
	const { user } = await parent();

	const form = await superValidate(groupInsertSchema);
	const userGroups = await db
		.select()
		.from(groups)
		.innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
		.where(eq(groupMembers.userId, user.id));

	return {
		form,
		groups: userGroups
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, groupInsertSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const session = await locals.getSession();
		if (!session?.user?.id) {
			return message(form, 'Unauthorized', {
				status: 401
			});
		}

		const user = await db.select().from(users).where(eq(users.auth_id, session.user.id)).get();
		if (!user) {
			return message(form, 'Unauthorized', {
				status: 401
			});
		}

		let groupId: string | undefined;
		await db.transaction(async (tx) => {
			const createdGroup = await tx.insert(groups).values(form.data).returning().get();
			logger.debug({ createdGroup }, 'Created group');

			const groupMember = await tx
				.insert(groupMembers)
				.values({
					groupId: createdGroup.id,
					userId: user.id,
					role: GroupMemberRole.Owner
				})
				.returning()
				.get();

			logger.debug({ groupMember }, 'Created group member');

			groupId = createdGroup.id;
		});
		if (!groupId) {
			return message(form, 'Failed to create group', {
				status: 500
			});
		}

		redirect(303, `/group/${groupId}`);
	}
};
