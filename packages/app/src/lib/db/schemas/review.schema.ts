import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { defaultColumns, idColumn } from '../default';
import { item } from './item.schema';
import { users } from './user.schema';

export const reviews = sqliteTable(
	'reviews',
	{
		id: idColumn,
		...defaultColumns,
		userId: text('user_id')
			.references(() => users.id)
			.notNull(),
		itemId: text('item_id')
			.references(() => item.id)
			.notNull(),
		rating: integer('rating').notNull(),
		text: text('text')
	},
	(t) => ({
		unq: unique().on(t.userId, t.itemId)
	})
);

export const reviewInsertSchema = createInsertSchema(reviews, {
	rating: z.number().min(1).max(5),
	text: z.string()
});
export type ReviewInsertSchema = typeof reviewInsertSchema;
export type ReviewInsert = z.infer<typeof reviewInsertSchema>;
