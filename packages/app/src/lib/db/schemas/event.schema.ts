import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import type z from 'zod';
import { defaultColumns, idColumn } from '../default';
import { groups } from './group.schema';
import { item } from './item.schema';
import { users } from './user.schema';

export type EventVisibility = 'group' | 'private';

export const events = sqliteTable('events', {
	id: idColumn,
	...defaultColumns,

	groupId: text('group_id')
		.references(() => groups.id)
		.notNull(),

	visibility: text('visibility')
		.$type<EventVisibility>()
		.$default(() => 'group')
		.notNull(),
	name: text('name').notNull(),
	beginAt: integer('begin_at', { mode: 'timestamp' }).notNull(),
	endAt: integer('end_at', { mode: 'timestamp' })
});

export type EventParticipantStatus = 'going' | 'maybe' | 'not_going';
export type EventParticipantType = 'host' | 'participant';

export const eventParticipants = sqliteTable(
	'event_participants',
	{
		id: idColumn,
		...defaultColumns,

		eventId: text('event_id')
			.references(() => events.id)
			.notNull(),
		userId: text('user_id')
			.references(() => users.id)
			.notNull(),
		type: text('type').$type<EventParticipantType>().notNull(),
		status: text('status').$type<EventParticipantStatus>().notNull()
	},
	(t) => ({
		unq: unique().on(t.eventId, t.userId)
	})
);

export const eventItems = sqliteTable(
	'event_items',
	{
		id: idColumn,
		...defaultColumns,

		eventId: text('event_id')
			.references(() => events.id)
			.notNull(),
		itemId: text('item')
			.references(() => item.id)
			.notNull()
	},
	(t) => ({
		unq: unique().on(t.eventId, t.itemId)
	})
);

export type EventItemVoteType = 'upvote' | 'downvote' | 'neutral';

export const eventItemVotes = sqliteTable(
	'event_item_votes',
	{
		id: idColumn,
		...defaultColumns,

		eventItemId: text('event_item_id')
			.references(() => eventItems.id)
			.notNull(),
		userId: text('user_id')
			.references(() => users.id)
			.notNull(),
		type: text('vote').$type<EventItemVoteType>().notNull()
	},
	(t) => ({
		unq: unique().on(t.eventItemId, t.userId)
	})
);

export const eventInsertSchema = createInsertSchema(events);
export type EventInsertSchema = typeof eventInsertSchema;
export type EventInsert = z.infer<typeof eventInsertSchema>;

export const eventParticipantInsertSchema = createInsertSchema(eventParticipants);
export type EventParticipantInsertSchema = typeof eventParticipantInsertSchema;
export type EventParticipantInsert = z.infer<typeof eventParticipantInsertSchema>;

export const eventItemInsertSchema = createInsertSchema(eventItems);
export type EventItemInsertSchema = typeof eventItemInsertSchema;
export type EventItemInsert = z.infer<typeof eventItemInsertSchema>;

export const eventItemVoteInsertSchema = createInsertSchema(eventItemVotes);
export type EventItemVoteInsertSchema = typeof eventItemVoteInsertSchema;
export type EventItemVoteInsert = z.infer<typeof eventItemVoteInsertSchema>;
