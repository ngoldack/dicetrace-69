import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { defaultColumns, idColumn } from '../default';
import { users } from './user.schema';

export const groups = sqliteTable('groups', {
	id: idColumn,
	...defaultColumns,

	name: text('name').notNull()
});

export enum GroupMemberRole {
	Owner = 'owner',
	Admin = 'admin',
	Member = 'member'
}

export const groupMembers = sqliteTable('group_members', {
	id: idColumn,
	...defaultColumns,

	role: text('role')
		.$type<GroupMemberRole>()
		.notNull()
		.$default(() => GroupMemberRole.Member),
	groupId: text('group_id')
		.references(() => groups.id)
		.notNull(),
	userId: text('user_id')
		.references(() => users.id)
		.notNull()
});

export const groupInsertSchema = createInsertSchema(groups);
export type GroupInsertSchema = typeof groupInsertSchema;
export type GroupInsert = z.infer<typeof groupInsertSchema>;
