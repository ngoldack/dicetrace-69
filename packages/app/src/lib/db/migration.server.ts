import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

import { createClient } from '@libsql/client';
import { dbConnection } from './connection.server';

const migrationClient = createClient(dbConnection);

const db = drizzle(migrationClient, {
	logger: true
});

let migrated = false;
export const runMigrations = async () => {
	if (migrated) return;
	migrated = true;

	await migrate(db, { migrationsFolder: './drizzle' });
	console.log('Migrations complete');
};
