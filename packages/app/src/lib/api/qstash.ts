import { env } from '$env/dynamic/private';
import logger from '$lib/logger';
import { error, type RequestHandler } from '@sveltejs/kit';
import { Receiver } from '@upstash/qstash';
import { nanoid } from 'nanoid';

if (!env.QSTASH_CURRENT_SIGNING_KEY) {
	error(500, {
		id: nanoid(),
		message: 'Missing QSTASH_CURRENT_SIGNING_KEY'
	});
}

if (!env.QSTASH_NEXT_SIGNING_KEY) {
	error(500, {
		id: nanoid(),
		message: 'Missing QSTASH_NEXT_SIGNING_KEY'
	});
}

const receiver = new Receiver({
	currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
	nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY
});

export const QStashRequestHandler = (handler: RequestHandler): RequestHandler => {
	// @ts-expect-error - Typescript doesn't like this, but it works.
	return async ({ headers, request, ...args }) => {
		const body = await request.text();

		const isValid = await receiver.verify({
			signature: request.headers.get('Upstash-Signature') ?? '',
			body
		});

		if (!isValid) {
			logger.error('Invalid signature', { signature: request.headers.get('Upstash-Signature') });
			error(401, {
				id: nanoid(),
				message: 'Invalid signature'
			});
		}

		// @ts-expect-error - Typescript doesn't like this, but it works.
		return handler({ headers, request, ...args, body });
	};
};
