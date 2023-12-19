import { db } from '$lib/db/client.server';
import {
	eventInsertSchema,
	eventParticipants,
	events,
	type EventVisibility
} from '$lib/db/schemas/event.schema';
import { users } from '$lib/db/schemas/user.schema';
import logger from '$lib/logger';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const load = async ({ params, locals }) => {
	const form = await superValidate(eventInsertSchema);

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ params, locals, request }) => {
		const form = await superValidate(request, eventInsertSchema);

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

		let eventId: string | undefined;
		await db.transaction(async (tx) => {
			const [event] = await tx
				.insert(events)
				.values({
					...form.data,
					visibility: form.data.visibility as EventVisibility,
					groupId: params.id
				})
				.returning();

			const participant = await tx.insert(eventParticipants).values({
				eventId: event.id,
				userId: user.id,
				type: 'host',
				status: 'maybe'
			});

			logger.debug({ event, participant }, 'Created event');
			eventId = event.id;
		});

		if (!eventId) {
			return message(form, 'Failed to create event', {
				status: 500
			});
		}

		redirect(303, `/event/${eventId}`);
	}
};
