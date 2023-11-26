import { db } from '$lib/db/client.server.js';
import { collection } from '$lib/db/schemas/collection.schema.js';
import { collectionItem } from '$lib/db/schemas/collectionItem.schema.js';
import { item } from '$lib/db/schemas/item.schema.js';
import { users } from '$lib/db/schemas/user.schema.js';
import { and, eq, inArray } from 'drizzle-orm';

export const load = async ({ parent, params, url }) => {
	const { session } = await parent();
	const { id } = params;

	const query = db
		.select()
		.from(item)
		.innerJoin(collectionItem, eq(collectionItem.itemId, item.id))
		.innerJoin(collection, eq(collection.id, collectionItem.collectionId))
		.innerJoin(users, eq(collection.userId, users.id))
		.where(and(eq(collection.userId, id), eq(users.public, true)))
		.$dynamic();

	const collections = url.searchParams.get('collections')?.split(',') ?? [];
	if (collections.length === 0) {
		return {
			collection: await query
		};
	}

	return {
		collection: await query.where(inArray(collection.id, collections))
	};
};
