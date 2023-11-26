import { defaultColumns, idColumn } from '../default';

import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { authUsers } from './auth.schema';

export enum UserType {
	ADMIN = 'admin',
	USER = 'user'
}

export const users = sqliteTable('user', {
	id: idColumn,
	...defaultColumns,

	type: text('type')
		.notNull()
		.$type<UserType>()
		.$default(() => UserType.USER),
	auth_id: text('auth_id')
		.unique()
		.references(() => authUsers.id),
	email: text('email').unique().notNull(),
	bgg_username: text('bgg_username'),

	stripe_customer_id: text('stripe_customer_id').unique(),
	public: integer('public', { mode: 'boolean' })
		.notNull()
		.default(sql`1`),
	name: text('name'),
	avatar: text('avatar').notNull()
});

export const selectUserSchema = createSelectSchema(users);
export type SelectUserSchema = typeof selectUserSchema;
export type User = z.infer<typeof selectUserSchema>;

export const insertUserSchema = createInsertSchema(users, {
	type: z.nativeEnum(UserType)
});
export type InsertUserSchema = typeof insertUserSchema;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const updateUserSchema = createInsertSchema(users);
