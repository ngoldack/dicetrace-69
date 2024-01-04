import { QStashRequestHandler } from '$lib/api/qstash';
import logger from '$lib/logger';
import { error } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { match } from 'ts-pattern';
import { welcomeSchema } from '.';

export const POST = QStashRequestHandler(async (body) => {
	return match(welcomeSchema.safeParse(body))
		.with(
			{
				success: false
			},
			({ error: e }) => {
				logger.error({ error: e, body }, 'Invalid request body');
				error(400, {
					id: nanoid(),
					message: 'Invalid request body',
					detail: e.message
				});
			}
		)
		.with({ success: true }, ({ data }) => {
			console.log(data);
			return new Response(JSON.stringify({ success: true }), {
				status: 200
			});
		})
		.exhaustive();
});
