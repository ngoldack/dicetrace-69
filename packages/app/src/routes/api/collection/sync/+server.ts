import { AuthenticatedRequestHandler } from '$lib/api/auth';
import { db } from '$lib/db/client.server';
import { collection } from '$lib/db/schemas/collection.schema';
import { collectionItem } from '$lib/db/schemas/collectionItem.schema';
import { item } from '$lib/db/schemas/item.schema';
import { users } from '$lib/db/schemas/user.schema';
import { error } from '@sveltejs/kit';
import { getBggCollection, getBggThing, type BggBoardgameItem } from 'bgg-xml-api-client';
import { and, eq, inArray } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = AuthenticatedRequestHandler(async ({ locals }) => {
	const session = await locals.getSession();

	if (!session?.user?.id) {
		throw error(401, {
			id: nanoid(),
			message: 'Unauthorized'
		});
	}

	const user = await db.select().from(users).where(eq(users.auth_id, session.user.id)).get();
	if (!user) {
		console.error('User not found');
		return new Response(null, {
			status: 401
		});
	}
	if (!user.bgg_username) {
		console.error('User has no bgg_username');
		return new Response(null, {
			status: 400
		});
	}

	const dbResp = await db
		.select({ id: item.bggId })
		.from(item)
		.innerJoin(collectionItem, eq(collectionItem.itemId, item.id))
		.innerJoin(collection, eq(collection.id, collectionItem.collectionId))
		.where(eq(collection.userId, user.id));
	const collIds = dbResp.map((row) => row.id);
	console.log('Syncing collection for user', user?.id ?? 'unknown');

	const resp = await getBggCollection({
		username: user.bgg_username,
		own: 1
	});

	const ids: number[] = resp.item.map((item) => {
		return item.objectid;
	}) as unknown as number[];
	console.log('Found', ids.length, 'items in bgg collection');

	const toBeAdded = ids.filter((id) => !collIds.includes(id));
	const toBeRemoved = collIds.filter((id) => !ids.includes(id));

	console.log('Adding', toBeAdded, 'items to collection');
	console.log('Removing', toBeRemoved.length, 'items from collection');

	// Fiter out items that are already in the db
	let toBeAddedFiltered: number[] = [];
	let dbIdsAlreadyInDB: string[] = [];
	if (toBeAdded.length > 0) {
		const dbRespAlreadyInDB = await db.select().from(item).where(inArray(item.bggId, toBeAdded));
		console.log('Found', dbRespAlreadyInDB.length, 'items that are already in the db');
		const dbBggIdsAlreadyInDB = dbRespAlreadyInDB.map((row) => row.bggId);
		toBeAddedFiltered = toBeAdded.filter((id) => !dbBggIdsAlreadyInDB.includes(id));
		dbIdsAlreadyInDB = dbRespAlreadyInDB.map((row) => row.id);
		console.log('Filtered out', toBeAddedFiltered.length, 'items that are already in the db');
	}

	let dbIdsInsertedItems: string[] = [];
	if (toBeAddedFiltered.length > 0) {
		// Get filtered items from bgg
		const toBeAddedResp = await getBggThing({
			id: toBeAddedFiltered
		});
		// @ts-ignore
		const items: BggBoardgameItem[] = toBeAddedResp.item;

		if (items.length > 0) {
			console.log('Found', items.length, 'items that are not in the db');
			const dbRespInsertedItems = await db
				.insert(item)
				.values(
					items.map((item) => {
						let name: string;
						if (Array.isArray(item.name)) {
							name = item.name.find((name) => name.type === 'primary')?.value ?? item.name[0].value;
						} else {
							name = item.name.value;
						}
						return {
							bggId: item.id,
							name,
							thumbnail: item.thumbnail,
							image: item.image,
							avgPlaytime: item.playingtime.value,
							minPlayers: item.minplayers.value,
							maxPlayers: item.maxplayers.value,
							minAge: item.minage.value,
							yearPublished: item.yearpublished.value,
							type: item.type,

							rating: item.statistics?.ratings?.average?.value ?? -1,
							weight: item.statistics?.ratings?.averageweight?.value ?? -1,

							description: item.description,
							raw: item
						};
					})
				)
				.returning({ id: item.id });
			dbIdsInsertedItems = dbRespInsertedItems.map((row) => row.id);
		}
	}

	await db.transaction(async (tx) => {
		// Get collection id
		const collectionId = await tx
			.select({ id: collection.id })
			.from(collection)
			.where(eq(collection.userId, user.id))
			.get();
		if (!collectionId) {
			throw new Error('Collection not found');
		}

		// Add items to collection
		if (dbIdsInsertedItems.length > 0) {
			const addToCollection = dbIdsInsertedItems.concat(dbIdsAlreadyInDB);
			console.log('Adding', addToCollection.length, 'items to collection');
			await db.insert(collectionItem).values(
				addToCollection.map((id) => {
					return {
						collectionId: collectionId.id,
						itemId: id
					};
				})
			);
		}
		// Remove items from collections
		if (toBeRemoved.length === 0) return;
		const dbToBeRemovedIds = await tx
			.select({ id: collectionItem.id })
			.from(collectionItem)
			.innerJoin(item, eq(item.id, collectionItem.itemId))
			.where(
				and(eq(collectionItem.collectionId, collectionId.id), inArray(item.bggId, toBeRemoved))
			);
		await tx.delete(collectionItem).where(
			inArray(
				collectionItem.id,
				dbToBeRemovedIds.map((row) => row.id)
			)
		);
	});

	return new Response();
});
