import type { ProviderType } from '@auth/core/providers';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { defaultColumns, idColumn } from '../default';

export const authUsers = sqliteTable('auth_users', {
	id: idColumn,
	...defaultColumns,

	email: text('email').notNull(),
	emailVerifiedAt: integer('email_verified_at', { mode: 'timestamp' }),

	name: text('name'),
	image: text('image')
});

export const authAccounts = sqliteTable(
	'auth_accounts',
	{
		id: idColumn,
		...defaultColumns,

		userId: text('user_id').notNull(),

		providerAccountId: text('provider_account_id').notNull(),
		provider: text('provider').notNull(),
		providerType: text('type').$type<Extract<ProviderType, 'oauth' | 'oidc' | 'email'>>().notNull(),
		expiresAt: integer('expires_at'),
		expiresIn: integer('expires_in'),

		accessToken: text('access_token'),
		idToken: text('id_token'),
		refreshToken: text('refresh_token'),
		scope: text('scope'),
		tokenType: text('token_type'),

		params: text('params', { mode: 'json' })
	},
	(t) => ({
		unq: unique().on(t.provider, t.providerAccountId)
	})
);

export const authSessions = sqliteTable('auth_sessions', {
	id: idColumn,
	...defaultColumns,

	token: text('token').notNull(),
	userId: text('user_id')
		.references(() => authUsers.id)
		.notNull(),
	expires: integer('expires', { mode: 'timestamp' }).notNull()
});

export const authVerificationTokens = sqliteTable('auth_verification_tokens', {
	id: idColumn,
	...defaultColumns,

	expires: integer('expires', { mode: 'timestamp' }).notNull(),
	token: text('token').unique().notNull(),
	isUsed: integer('is_used', { mode: 'boolean' })
		.notNull()
		.$default(() => false)
});
