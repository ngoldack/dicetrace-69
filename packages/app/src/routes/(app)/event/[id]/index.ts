import { eventItemInsertSchema, eventItemVoteInsertSchema } from '$lib/db/schemas/event.schema';

export const createEventItemSchema = eventItemInsertSchema.pick({
	itemId: true
});
export type CreateEventItemSchema = typeof createEventItemSchema;

export const createEventItemVoteSchema = eventItemVoteInsertSchema.pick({
	eventItemId: true,
	type: true
});
export type CreateEventItemVoteSchema = typeof createEventItemVoteSchema;
