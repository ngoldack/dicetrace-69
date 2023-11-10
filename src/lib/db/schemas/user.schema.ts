import { sql } from 'drizzle-orm';
import { varchar } from 'drizzle-orm/pg-core';
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import type z from 'zod';

export const user = pgTable('user', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	email: varchar('email', {
		length: 255
	})
		.unique()
		.notNull()
});

export const selectUserSchema = createSelectSchema(user);
export type SelectUserSchema = typeof selectUserSchema;
export type User = z.infer<typeof selectUserSchema>;
