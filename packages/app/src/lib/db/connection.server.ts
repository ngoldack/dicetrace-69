import { env } from '$env/dynamic/private';
import type { Config } from '@libsql/client';

export const dbConnection: Config = { url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN };
