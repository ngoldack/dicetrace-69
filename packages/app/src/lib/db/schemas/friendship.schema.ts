import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { defaultColumns, idColumn } from '../default';
import { users } from './user.schema';

export const friendship = sqliteTable(
	'friendship',
	{
		id: idColumn,
		...defaultColumns,

		user1: text('user_1')
			.notNull()
			.references(() => users.id),
		user2: text('user_2')
			.notNull()
			.references(() => users.id)
	},
	(t) => ({
		befriend_way_1: unique().on(t.user1, t.user2),
		befriend_way_2: unique().on(t.user2, t.user1)
	})
);
