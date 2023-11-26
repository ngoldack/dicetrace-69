import { db } from '$lib/db/client.server';
import {
	eventItemVotes,
	eventItems,
	eventParticipants,
	type EventItemVoteType
} from '$lib/db/schemas/event.schema';
import { users } from '$lib/db/schemas/user.schema';
import logger from '$lib/logger';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms/server';
import { createEventItemSchema } from '.';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const createForm = await superValidate(createEventItemSchema);
	return {
		createForm
	};
};

export const actions: Actions = {
	vote: async ({ params, locals, request }) => {
		const formData = await request.formData();
		logger.debug({ params, formData }, 'Voting for event item');

		const type = formData.get('type');
		const eventItemId = formData.get('eventItemId');
		if (!eventItemId) return fail(400, { message: 'Missing eventItemId' });

		const session = await locals.getSession();
		if (!session?.user?.id) {
			return fail(401, { message: 'Unauthorized' });
		}

		const user = await db.select().from(users).where(eq(users.auth_id, session.user.id)).get();
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const vote = await db
			.select()
			.from(eventItemVotes)
			.where(eq(eventItemVotes.userId, user.id))
			.get();
		if (!vote && type !== undefined) {
			await db.insert(eventItemVotes).values({
				eventItemId: eventItemId as string,
				userId: user.id,
				type: type as EventItemVoteType
			});
			return;
		}

		if (type === undefined) {
			await db
				.delete(eventItemVotes)
				.where(
					and(
						eq(eventItemVotes.eventItemId, eventItemId as string),
						eq(eventItemVotes.userId, user.id)
					)
				);
			return;
		}

		await db
			.update(eventItemVotes)
			.set({
				type: type as EventItemVoteType
			})
			.where(
				and(
					eq(eventItemVotes.eventItemId, eventItemId as string),
					eq(eventItemVotes.userId, user.id)
				)
			);
	},
	addItem: async ({ locals, request, params }) => {
		const form = await superValidate(request, createEventItemSchema);

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

		let success = false;
		await db.transaction(async (tx) => {
			const [eventItem] = await tx
				.insert(eventItems)
				.values({
					...form.data,
					eventId: params.id
				})
				.returning();

			logger.debug({ eventItem }, 'Added event item');

			const [vote] = await tx
				.insert(eventItemVotes)
				.values({
					eventItemId: eventItem.id,
					userId: user.id,
					type: 'upvote'
				})
				.returning();

			logger.debug({ eventItem, vote }, 'Added event item vote');

			success = true;
		});

		if (!success) {
			return message(form, 'Failed to add item', {
				status: 500
			});
		}
	},
	join: async ({ params, locals }) => {
		const session = await locals.getSession();
		if (!session?.user?.id) {
			return fail(401, { message: 'Unauthorized' });
		}

		const user = await db.select().from(users).where(eq(users.auth_id, session.user.id)).get();
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		await db.transaction(async (tx) => {
			await tx.insert(eventParticipants).values({
				eventId: params.id,
				userId: user.id,
				type: 'participant',
				status: 'maybe'
			});

			logger.debug({ eventId: params.id, userId: user.id }, 'Joined event');
		});

		throw redirect(302, `/event/${params.id}`);
	},

	leave: async ({ params, locals }) => {
		const session = await locals.getSession();
		if (!session?.user?.id) {
			return fail(401, { message: 'Unauthorized' });
		}

		const user = await db.select().from(users).where(eq(users.auth_id, session.user.id)).get();
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		await db.transaction(async (tx) => {
			await tx
				.delete(eventParticipants)
				.where(
					and(eq(eventParticipants.eventId, params.id), eq(eventParticipants.userId, user.id))
				);

			logger.debug({ eventId: params.id, userId: user.id }, 'Left event');
		});

		throw redirect(302, '/');
	}
};
