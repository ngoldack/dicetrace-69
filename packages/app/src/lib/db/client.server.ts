import { drizzle } from 'drizzle-orm/libsql';

import { collection } from './schemas/collection.schema';
import { collectionItem } from './schemas/collectionItem.schema';
import { events } from './schemas/event.schema';
import { friendship } from './schemas/friendship.schema';
import { item } from './schemas/item.schema';
import { users } from './schemas/user.schema';

import defaultLogger from '$lib/logger';
import { createClient } from '@libsql/client';
import { dbConnection } from './connection.server';

const client = createClient(dbConnection);
const logger = defaultLogger.child({ name: 'db' });

export const db = drizzle(client, {
	schema: {
		friendship,
		users,
		item,
		collection,
		collectionItem,
		events
	},
	logger: {
		logQuery: (query, params) => {
			logger.debug({ params }, 'exec: %s', query);
		}
	}
});
