import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { defaultColumns, idColumn } from '../default';

export enum NotificationStatus {
	Unread = 'unread',
	Read = 'read'
}

export enum NotificationContentType {
	FriendRequest = 'friend-request',
	GroupInvitation = 'group-invitation',
	Welcome = 'welcome'
}

export type NotificationContent =
	| { type: NotificationContentType.FriendRequest; from: string }
	| { type: NotificationContentType.GroupInvitation; from: string; group: string }
	| { type: NotificationContentType.Welcome };

export const notifications = sqliteTable('notifications', {
	id: idColumn,
	...defaultColumns,

	status: text('status').$type<NotificationStatus>().notNull().default(NotificationStatus.Unread),
	userId: text('user_id').notNull(),
	readAt: integer('read_at', { mode: 'timestamp' }),

	contentType: text('type').notNull().$type<NotificationContentType>(),
	content: text('content').notNull().$type<NotificationContent>()
});

export const notificationInsertSchema = createInsertSchema(notifications, {
	contentType: z.nativeEnum(NotificationContentType),
	status: z.nativeEnum(NotificationStatus),
	content: z.unknown()
});
export type NotificationInsertSchema = typeof notificationInsertSchema;
export type NotificationInsert = z.infer<typeof notificationInsertSchema>;

export const notificationSelectSchema = createSelectSchema(notifications, {
	contentType: z.nativeEnum(NotificationContentType),
	status: z.nativeEnum(NotificationStatus),
	content: z.unknown()
});
export type NotificationSelectSchema = typeof notificationSelectSchema;
export type NotificationSelect = z.infer<typeof notificationSelectSchema>;
