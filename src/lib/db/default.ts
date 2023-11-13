import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/sqlite-core';

export const defaultColumns = {
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const idColumn = text("id").$default(() => createId()).primaryKey();
