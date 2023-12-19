import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { customAlphabet } from 'nanoid';
import { defaultColumns, idColumn } from '../default';
import { users } from './user.schema';

const createCode = customAlphabet(
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	20
);

export const bggVerification = sqliteTable('verification', {
	id: idColumn,
	...defaultColumns,

	userId: text('user_id')
		.references(() => users.id)
		.notNull(),
	username: text('username').notNull(),
	code: text('code')
		.notNull()
		.$default(() => createCode())
		.unique(),

	verified: integer('verified', { mode: 'boolean' })
		.notNull()
		.$default(() => false),
	verifiedAt: integer('verified_at', { mode: 'timestamp' })
});
