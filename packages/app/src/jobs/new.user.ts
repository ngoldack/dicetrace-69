import { db } from '$lib/db/client.server';
import { collection } from '$lib/db/schemas/collection.schema';
import { insertUserSchema, users } from '$lib/db/schemas/user.schema';
import { stripe } from '$lib/server/stripe/client';
import { eventTrigger } from '@trigger.dev/sdk';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { z } from 'zod';
import { client } from '../trigger';

export const newUserSchema = insertUserSchema.pick({
	email: true,
	name: true,
	auth_id: true,
	bgg_username: true
});
export type NewUser = z.infer<typeof newUserSchema>;

client.defineJob({
	id: 'new.user',
	name: 'new user',
	version: '0.0.1',
	trigger: eventTrigger({
		name: 'new.user',
		schema: newUserSchema
	}),
	run: async (payload, io, ctx) => {
		await io.logger.info('Hello world!', { payload, ctx });

		const id = nanoid();
		await db.transaction(async (tx) => {
			let customerId: string | undefined;
			try {
				const user = await tx
					.insert(users)
					.values({
						id,
						email: payload.email,
						name: payload.name,
						auth_id: payload.auth_id,
						avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${id}`
					})
					.returning()
					.get();

				await tx.insert(collection).values({
					userId: id,
					name: 'Default'
				});

				const customer = await stripe.customers.create({
					name: user.name ?? undefined,
					email: user.email,
					metadata: {
						userId: id
					}
				});
				customerId = customer.id;

				await tx.update(users).set({ stripe_customer_id: customerId }).where(eq(users.id, id));

				io.logger.info('User created', { id, stripe_customer_id: customerId });
			} catch (error) {
				io.logger.error("An error occurred while creating the user's account", { error });
				try {
					tx.rollback();
					if (customerId) await stripe.customers.del(customerId);
				} catch (error) {
					io.logger.error('An error occoured whilst deleting stripe customer', {
						error,
						customerId
					});
				}
			}
		});
	}
});
