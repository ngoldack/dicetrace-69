import { db } from '$lib/db/client.server';
import { collection } from '$lib/db/schemas/collection.schema';
import { NotificationContentType, notifications } from '$lib/db/schemas/notification.schema';
import { UserType, insertUserSchema, users } from '$lib/db/schemas/user.schema';
import logger from '$lib/logger';
import { stripe } from '$lib/server/stripe/client';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { superValidate } from 'sveltekit-superforms/server';
import { helloSchema } from '.';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (session?.user?.id) {
		const user = await db.select().from(users).where(eq(users.auth_id, session.user.id)).get();
		if (user) {
			redirect(303, '/');
		}
	}

	const form = await superValidate(helloSchema);

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, helloSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const session = await locals.getSession();
		const id = nanoid();
		const parsed = insertUserSchema.parse({
			id,
			type: UserType.USER,
			email: session?.user?.email,
			name: form.data.name,
			bgg_username: form.data.bgg_username,
			auth_id: session?.user?.id,
			avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${id}`
		});

		await db.transaction(async (tx) => {
			let customerId: string | undefined;
			try {
				const user = await tx.insert(users).values(parsed).returning().get();

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

				await db.insert(notifications).values({
					userId: user.id,
					contentType: NotificationContentType.Welcome,
					content: {
						type: NotificationContentType.Welcome
					}
				});

				logger.info({ id, stripe_customer_id: customerId }, 'User created');
			} catch (error) {
				logger.error({ error }, "An error occurred while creating the user's account");
				try {
					tx.rollback();
					if (customerId) await stripe.customers.del(customerId);
				} catch (error) {
					logger.error(
						{
							error,
							customerId
						},
						'An error occoured whilst deleting stripe customer'
					);
				}
			}
		});

		redirect(303, '/');
	}
};
