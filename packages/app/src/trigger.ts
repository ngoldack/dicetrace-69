import { env } from '$env/dynamic/private';
import { TriggerClient } from '@trigger.dev/sdk';

export const client = new TriggerClient({
	id: 'dicetrace',
	apiKey: env.TRIGGER_API_KEY,
	apiUrl: env.TRIGGER_API_URL ?? 'https://api.trigger.dev'
});
