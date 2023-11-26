import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { defaultColumns, idColumn } from '../default';
import { users } from './user.schema';

export enum InvitationType {
	Group = 'group',
	Friend = 'friend'
}

export enum InvitationStatus {
	Pending = 'pending',
	Accepted = 'accepted',
	Declined = 'declined'
}

export const invitations = sqliteTable('invitations', {
	id: idColumn,
	...defaultColumns,

	type: text('type').notNull(),
	for: text('for_id')
		.references(() => users.id)
		.notNull(),
	from: text('from_id')
		.references(() => users.id)
		.notNull(),
	status: text('status')
		.$type<InvitationStatus>()
		.$default(() => InvitationStatus.Pending)
		.notNull()
});
