import { db } from '$lib/db/client.server';
import { collection } from '$lib/db/schemas/collection.schema';
import { collectionItem } from '$lib/db/schemas/collectionItem.schema';
import { eventParticipants, events } from '$lib/db/schemas/event.schema';
import { groupMembers, groups } from '$lib/db/schemas/group.schema';
import { item } from '$lib/db/schemas/item.schema';
import { users } from '$lib/db/schemas/user.schema';
import { error } from '@sveltejs/kit';
import { and, eq, isNull, lte, or, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { LayoutServerLoad } from './$types';

const showPastEventsDelay = 1000 * 60 * 60 * 3;

export const load: LayoutServerLoad = async ({ parent, params }) => {
	const { user } = await parent();

	const [{ count }] = await db
		.select({
			count: sql<number>`count(*)`
		})
		.from(groupMembers)
		.where(and(eq(groupMembers.userId, user.id), eq(groupMembers.groupId, params.id)));
	if (count === 0) {
		error(403, {
			id: nanoid(),
			message: 'You are not a member of this group'
		});
	}

	const data = await db
		.select()
		.from(item)
		.innerJoin(collectionItem, eq(collectionItem.itemId, item.id))
		.innerJoin(collection, eq(collection.id, collectionItem.collectionId))
		.innerJoin(users, eq(users.id, collection.userId))
		.innerJoin(groupMembers, eq(groupMembers.userId, users.id))
		.innerJoin(groups, eq(groups.id, groupMembers.groupId))
		.where(eq(groupMembers.groupId, params.id));

	const group = data.map((row) => row.groups).pop();
	const items = data
		.map((row) => {
			return {
				item: row.item,
				collection: row.collection,
				user: row.user
			};
		})
		.filter((row, index, self) => self.findIndex((t) => t.item.id === row.item.id) === index);
	const collections = data
		.map((row) => row.collection)
		.filter((row, index, self) => self.findIndex((t) => t.id === row.id) === index);
	const members = data
		.map((row) => {
			return {
				user: row.user,
				membership: row.group_members
			};
		})
		.filter((row, index, self) => self.findIndex((t) => t.user.id === row.user.id) === index);

	const e = await db
		.select()
		.from(events)
		.leftJoin(eventParticipants, eq(eventParticipants.eventId, events.id))
		.where(
			and(
				eq(events.groupId, params.id),
				or(eq(events.visibility, 'group'), eq(eventParticipants.eventId, events.id)),
				or(lte(events.endAt, new Date(Date.now() + showPastEventsDelay)), isNull(events.endAt))
			)
		)
		.orderBy(events.beginAt);

	return {
		group,
		items,
		collections,
		members,
		events: e
			.map((row) => {
				return {
					event: row.events,
					participant: row.event_participants,
					isInPast: row.events.endAt
						? row.events.endAt.getTime() <= Date.now() + showPastEventsDelay
						: false
				};
			})
			.filter((row, index, self) => self.findIndex((t) => t.event.id === row.event.id) === index)
	};
};
