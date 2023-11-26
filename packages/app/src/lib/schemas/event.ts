import z from 'zod';

export type EventType = 'collection_item_added' | 'collection_item_removed' | 'follower_new';

export const eventSchema = z
	.discriminatedUnion('type', [
		z.object({
			type: z.literal('collection_item_added'),
			details: z.object({
				collectionId: z.string().uuid(),
				itemId: z.string().uuid()
			})
		})
	])
	.and(
		z.object({
			userId: z.string().uuid(),
			createdAt: z.date(),
			updatedAt: z.date()
		})
	);

export const EventSchema = typeof eventSchema;
export type Event = z.infer<typeof eventSchema>;
