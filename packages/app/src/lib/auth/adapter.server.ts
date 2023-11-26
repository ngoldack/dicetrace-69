import { db } from '$lib/db/client.server';
import {
	authAccounts,
	authSessions,
	authUsers,
	authVerificationTokens
} from '$lib/db/schemas/auth.schema';
import defaultLogger from '$lib/logger';
import type { Adapter } from '@auth/core/adapters';
import { and, eq } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

const logger = defaultLogger.child({ name: 'db' });

export const DrizzleAdapter = (): Adapter => {
	return {
		createSession: async (session) => {
			await db.insert(authSessions).values({
				token: session.sessionToken,
				userId: session.userId,
				expires: session.expires
			});
			return session;
		},
		createUser: async (user) => {
			const created = await db
				.insert(authUsers)
				.values({
					name: user.name,
					email: user.email,
					emailVerifiedAt: user.emailVerified,
					image: user.image
				})
				.returning()
				.get();

			return {
				...user,
				id: created.id
			};
		},
		createVerificationToken: async (verificationToken) => {
			const token = await db
				.insert(authVerificationTokens)
				.values({
					expires: verificationToken.expires,
					token: verificationToken.token
				})
				.returning()
				.get();

			return {
				identifier: token.id,
				token: token.token,
				expires: token.expires
			};
		},
		linkAccount: async (account) => {
			const {
				providerAccountId,
				userId,
				provider,
				type,
				expires_at,
				expires_in,
				access_token,
				id_token,
				refresh_token,
				scope,
				token_type,
				...params
			} = account;
			await db.insert(authAccounts).values({
				userId: userId,
				provider: provider,
				providerType: type,
				providerAccountId: providerAccountId,

				expiresAt: expires_at,
				expiresIn: expires_in,
				scope: scope,
				tokenType: token_type,

				accessToken: access_token,
				idToken: id_token,
				refreshToken: refresh_token,

				params: params
			});
		},
		unlinkAccount: async (providerAccountId) => {
			await db
				.delete(authAccounts)
				.where(
					and(
						eq(authAccounts.provider, providerAccountId.provider),
						eq(authAccounts.providerAccountId, providerAccountId.providerAccountId)
					)
				);
		},
		deleteSession: async (sessionToken) => {
			await db.delete(authSessions).where(eq(authSessions.token, sessionToken));
		},
		deleteUser: async (userId) => {
			await db.delete(authUsers).where(eq(authUsers.id, userId));
		},
		getSessionAndUser: async (sessionToken) => {
			const resp = await db
				.select()
				.from(authSessions)
				.innerJoin(authUsers, eq(authSessions.userId, authUsers.id))
				.where(eq(authSessions.token, sessionToken))
				.get();

			if (!resp) return null;
			return {
				session: {
					expires: resp.auth_sessions.expires,
					sessionToken: resp.auth_sessions.token,
					userId: resp.auth_sessions.userId
				},
				user: {
					id: resp.auth_users.id,
					email: resp.auth_users.email,
					emailVerified: resp.auth_users.emailVerifiedAt,
					image: resp.auth_users.image,
					name: resp.auth_users.name
				}
			};
		},
		getUser: async (id) => {
			const user = await db.select().from(authUsers).where(eq(authUsers.id, id)).get();

			if (!user) return null;
			return {
				id: user.id,
				email: user.email,
				emailVerified: user.emailVerifiedAt,
				image: user.image,
				name: user.name
			};
		},
		getUserByAccount: async (providerAccountId) => {
			const err = (err: unknown) => {
				logger.error({ providerAccountId }, 'Invalid provider account ID');
				return err;
			};
			const result = await ResultAsync.fromPromise(
				db
					.select({
						id: authUsers.id,
						email: authUsers.email,
						emailVerified: authUsers.emailVerifiedAt,
						image: authUsers.image,
						name: authUsers.name
					})
					.from(authAccounts)
					.innerJoin(authUsers, eq(authAccounts.userId, authUsers.id))
					.where(
						and(
							eq(authAccounts.provider, providerAccountId.provider),
							eq(authAccounts.providerAccountId, providerAccountId.providerAccountId)
						)
					)
					.get(),
				err
			);
			return result.match(
				(user) => user ?? null,
				(err) => {
					logger.error({ providerAccountId, err }, 'Error getting user by account');
					return null;
				}
			);
		},
		getUserByEmail: async (email) => {
			const user = await db.select().from(authUsers).where(eq(authUsers.email, email)).get();
			if (!user) return null;
			return {
				id: user.id,
				email: user.email,
				emailVerified: user.emailVerifiedAt,
				image: user.image,
				name: user.name
			};
		},
		updateSession: async (session) => {
			const resp = await db
				.update(authSessions)
				.set({
					updatedAt: new Date(Date.now()),
					expires: session.expires,
					userId: session.userId
				})
				.where(eq(authSessions.token, session.sessionToken))
				.returning()
				.get();
			return {
				expires: resp.expires,
				sessionToken: resp.token,
				userId: resp.userId
			};
		},
		updateUser: async (user) => {
			const resp = await db
				.update(authUsers)
				.set({
					updatedAt: new Date(Date.now()),
					name: user.name,
					email: user.email,
					emailVerifiedAt: user.emailVerified,
					image: user.image
				})
				.where(eq(authUsers.id, user.id))
				.returning()
				.get();
			return {
				id: resp.id,
				email: resp.email,
				emailVerified: resp.emailVerifiedAt,
				image: resp.image,
				name: resp.name
			};
		},
		useVerificationToken: async (params) => {
			const verificationToken = await db
				.select()
				.from(authVerificationTokens)
				.where(
					and(
						eq(authVerificationTokens.id, params.identifier),
						eq(authVerificationTokens.token, params.token),
						eq(authVerificationTokens.isUsed, false)
					)
				)
				.get();
			if (!verificationToken) return null;
			await db
				.update(authVerificationTokens)
				.set({
					updatedAt: new Date(Date.now()),
					isUsed: true
				})
				.where(eq(authVerificationTokens.id, params.identifier));
			return {
				identifier: verificationToken.id,
				expires: verificationToken.expires,
				token: verificationToken.token
			};
		}
	} satisfies Adapter;
};
