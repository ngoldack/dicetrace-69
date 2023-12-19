import { db } from '$lib/db/client.server';
import { bggVerification } from '$lib/db/schemas/bggVerfication';
import logger from '$lib/logger';
import { BggClient } from 'boardgamegeekclient';
import { and, eq } from 'drizzle-orm';

export const verifyCode = async (userId: string, username: string, code: string) => {
	const client = BggClient.Create();

	const user = await client.user.query({
		name: username
	});

	if (!user || user.length === 0) {
		return false;
	}

	for (const u of user) {
		if (u.name === username && u.webaddress === code) {
			return true;
		}
	}

	const result = await db
		.update(bggVerification)
		.set({ verified: true, verifiedAt: new Date(Date.now()) })
		.where(
			and(
				eq(bggVerification.userId, userId),
				eq(bggVerification.username, username),
				eq(bggVerification.code, code)
			)
		);

	if (result.rowsAffected === 1) {
		logger.info({ userId, username }, 'Verified BGG account');
		return true;
	}

	logger.info({ userId, username }, 'Failed to verify BGG account');
	return false;
};
