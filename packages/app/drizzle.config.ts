import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';
dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined');
if (!process.env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not defined');

export default {
	schema: './src/lib/db/schemas/*',
	out: './drizzle',
	breakpoints: true,
	driver: 'turso',
	verbose: true,
	dbCredentials: {
		url: process.env.DATABASE_URL,
		authToken: process.env.DATABASE_AUTH_TOKEN
	}
} satisfies Config;
