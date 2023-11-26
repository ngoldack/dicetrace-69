import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { defaultColumns, idColumn } from '../default';
import { item } from './item.schema';
import { users } from './user.schema';

export const matches = sqliteTable('matches', {
	id: idColumn,
	...defaultColumns,

	itemId: text('item_id')
		.references(() => item.id)
		.notNull(),

	startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
	endedAt: integer('ended_at', { mode: 'timestamp' })
});

export const matchParticipants = sqliteTable('match_participants', {
	id: idColumn,
	...defaultColumns,

	matchId: text('match_id')
		.references(() => matches.id)
		.notNull(),
	userId: text('user_id')
		.references(() => users.id)
		.notNull()
});

export const matchResults = sqliteTable('match_results', {
	id: idColumn,
	...defaultColumns,

	matchId: text('match_id')
		.references(() => matches.id)
		.notNull(),
	userId: text('user_id')
		.references(() => users.id)
		.notNull(),

	score: integer('score').notNull(),
	winner: integer('winner', { mode: 'boolean' }).notNull(),

	blob: text('blob', { mode: 'json' })
});
