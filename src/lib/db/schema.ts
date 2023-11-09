import type { AdapterAccount } from '@auth/core/adapters';
import { sql } from 'drizzle-orm';
import { integer, json, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const Users = pgTable('user', {
	id: uuid('id')
		.notNull()
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image')
});

export const Accounts = pgTable(
	'account',
	{
		userId: uuid('userId')
			.notNull()
			.references(() => Users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => ({
		compoundKey: primaryKey(account.provider, account.providerAccountId)
	})
);

export const Sessions = pgTable('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: uuid('userId')
		.notNull()
		.references(() => Users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const VerificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey(vt.identifier, vt.token)
	})
);

export const Games = pgTable('game', {
	id: uuid('id')
		.notNull()
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	bggId: integer('bgg_id').unique(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
	raw: json('raw')
});
