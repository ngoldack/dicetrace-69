import { integer, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const defaultColumns = {
	createdAt: integer('createdAt', { mode: 'timestamp' })
		.notNull()
		.$default(() => new Date(Date.now())),
	updatedAt: integer('updatedAt', { mode: 'timestamp' })
		.notNull()
		.$default(() => new Date(Date.now()))
};

export const idColumn = text('id')
	.$default(() => nanoid())
	.primaryKey();
