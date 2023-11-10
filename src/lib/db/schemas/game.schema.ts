import { sql } from 'drizzle-orm';
import { integer, json, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

export const Games = pgTable('game', {
	id: uuid('id')
		.notNull()
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	bggId: integer('bgg_id').unique(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
	raw: json('raw')
});
