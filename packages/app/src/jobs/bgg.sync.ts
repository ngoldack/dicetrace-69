import { eventTrigger } from '@trigger.dev/sdk';
import { z } from 'zod';
import { client } from '../trigger';

export const syncSchema = z.object({
	userId: z.string()
});

client.defineJob({
	id: 'sync',
	name: 'sync',
	version: '0.0.1',
	trigger: eventTrigger({
		name: 'sync',
		schema: syncSchema
	}),
	run: async (payload, io, ctx) => {
		await io.logger.info('Hello world!', { payload, ctx });

		return {
			message: 'Hello world!'
		};
	}
});
