import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { Client } from '@upstash/qstash';
import { nanoid } from 'nanoid';

if (!env.QSTASH_TOKEN) {
	error(500, {
		id: nanoid(),
		message: 'Missing QSTASH_TOKEN'
	});
}

export const qstash = new Client({
	token: env.QSTASH_TOKEN
});
