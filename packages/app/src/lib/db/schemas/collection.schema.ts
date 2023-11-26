import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { defaultColumns, idColumn } from '../default';
import { users } from './user.schema';

export type CollectionVisibility = 'public';

export const collection = sqliteTable('collection', {
	id: idColumn,
	...defaultColumns,

	name: text('name')
		.notNull()
		.default(sql`'New Collection'`),
	userId: text('user_id')
		.references(() => users.id)
		.notNull(),
	visibility: text('visibility')
		.$type<CollectionVisibility>()
		.$default(() => 'public')
		.notNull()
});
