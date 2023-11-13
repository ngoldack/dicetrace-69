import { defaultColumns, idColumn } from '../default';

import type z from 'zod';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const user = sqliteTable('user', {
	id: idColumn,
	...defaultColumns,

	auth_id: text('auth_id')
		.unique()
		.notNull(),
	email: text('email')
		.unique()
		.notNull(),

	name: text('name'),
	avatar: text('avatar').notNull(),
});

export const selectUserSchema = createSelectSchema(user);
export type SelectUserSchema = typeof selectUserSchema;
export type User = z.infer<typeof selectUserSchema>;

export const insertUserSchema = createInsertSchema(user)
export type InsertUserSchema = typeof insertUserSchema;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const updateUserSchema = createInsertSchema(user)