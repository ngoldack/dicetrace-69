import { CronRequestHandler } from '$lib/api/cron';
import { GameSchema } from '$lib/bgg/thing';
import { db } from '$lib/db/conn.server';
import { Games } from '$lib/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import bggXmlApiClient from 'bgg-xml-api-client';
import { eq, isNotNull, lte } from 'drizzle-orm';

const updateDelay = 1000 * 60 * 10; // 1 hour

// Updates the game database with the latest data from BGG.
export const GET: RequestHandler = CronRequestHandler(async () => {
	const resp = await db
		.select({ bggId: Games.bggId })
		.from(Games)
		.where(lte(Games.updatedAt, new Date(Date.now() - updateDelay)))
		.where(isNotNull(Games.bggId));

	const ids = resp.map((g) => {
		return g.bggId ?? 0;
	});

	const rawGames = await bggXmlApiClient.getBggThing({
		id: ids,
		type: 'boardgame'
	});

	const games = GameSchema.array().parse(rawGames.item);

	games.forEach((game) => {
		db.update(Games)
			.set({
				raw: game,
				updatedAt: new Date(Date.now())
			})
			.where(eq(Games.bggId, game.id));
	});

	console.log(`Updated ${games.length} games`);
	return new Response(null);
});
