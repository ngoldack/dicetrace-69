import { db } from '$lib/db/client.server';
import { collection } from '$lib/db/schemas/collection.schema';
import { collectionItem } from '$lib/db/schemas/collectionItem.schema';
import {
	eventItemVotes,
	eventItems as eventItemsTable,
	eventParticipants,
	events
} from '$lib/db/schemas/event.schema';
import { item } from '$lib/db/schemas/item.schema';
import { users as userTable } from '$lib/db/schemas/user.schema';
import { error } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, parent }) => {
	const { user } = await parent();

	const [{ count }] = await db
		.select({
			count: sql`count(*)`
		})
		.from(events)
		.innerJoin(eventParticipants, eq(eventParticipants.eventId, events.id))
		.where(eq(eventParticipants.userId, user.id));

	if (count === 0) {
		throw error(403, {
			id: nanoid(),
			message: 'You are not a member of this event'
		});
	}

	const data = await db
		.select()
		.from(events)
		.innerJoin(eventParticipants, eq(eventParticipants.eventId, events.id))
		.innerJoin(userTable, eq(userTable.id, eventParticipants.userId))
		.where(eq(eventParticipants.userId, user.id));

	const users = data.map((row) => row.user);
	const event = data.map((row) => row.events).pop();

	const participants = data
		.map((row) => {
			return {
				user: row.user,
				participant: row.event_participants
			};
		})
		.filter((row, index, self) => self.findIndex((t) => t.user.id === row.user.id) === index);

	const items = await db
		.select({
			item: item,
			user: userTable
		})
		.from(item)
		.innerJoin(collectionItem, eq(collectionItem.itemId, item.id))
		.innerJoin(collection, eq(collection.id, collectionItem.collectionId))
		.innerJoin(userTable, eq(userTable.id, collection.userId))
		.innerJoin(eventParticipants, eq(eventParticipants.userId, userTable.id))
		.innerJoin(events, eq(events.id, eventParticipants.eventId))
		.where(eq(eventParticipants.eventId, events.id))
		.groupBy(item.id);

	const eventItems = await db
		.select({
			event_item_votes: eventItemVotes,
			event_items: eventItemsTable,
			item: item,
			collection: collection
		})
		.from(eventItemsTable)
		.innerJoin(item, eq(item.id, eventItemsTable.itemId))
		.leftJoin(eventItemVotes, eq(eventItemVotes.eventItemId, eventItemsTable.id))
		.innerJoin(collectionItem, eq(collectionItem.itemId, item.id))
		.innerJoin(collection, eq(collection.id, collectionItem.collectionId))
		.where(eq(eventItemsTable.eventId, event?.id ?? ''));

	// Typescript shinanigans
	const isVote = (
		vote: typeof eventItemVotes.$inferSelect | undefined
	): vote is typeof eventItemVotes.$inferSelect => !!vote;
	const votes = eventItems.map((item) => item.event_item_votes ?? undefined).filter(isVote);

	return {
		event: event,
		participants,
		eventItems,
		items,
		votes,
		users
	};
};
