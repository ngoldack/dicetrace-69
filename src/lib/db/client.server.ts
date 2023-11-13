import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/libsql';

import { friendship } from './schemas/friendship.schema';
import { item } from './schemas/item.schema';
import { user } from './schemas/user.schema';
import { collection } from './schemas/collection.schema';
import { collectionItem } from './schemas/collectionItem.schema';
import { event } from './schemas/event.schema';

import { createClient } from '@libsql/client';

const client = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });

export const db = drizzle(client, {
    schema: {
        friendship,
        user,
        item,
        collection,
        collectionItem,
        event,
    },
    logger: true
});
