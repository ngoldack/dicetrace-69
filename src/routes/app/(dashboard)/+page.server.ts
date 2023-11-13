import { db } from "$lib/db/client.server";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { createId } from "@paralleldrive/cuid2";
import { event, eventSelectSchema, type EventSelect } from "$lib/db/schemas/event.schema";
import type { ActivityType } from "flowbite-svelte";
import { eventSchema } from "$lib/schemas/event";

export const load: PageServerLoad = async ({ locals, parent }) => {
    if(!locals.user) {
        throw error(401, {
            id: createId(),
            message: 'You must be logged in to view this page.'
        });
    }
    const events = eventSelectSchema.array().parse(await db.select().from(event).where(eq(event.userId, locals.user?.id)));

    return {
        ...(await parent()),
        activities: parseActivities(events),
    }
};

const parseActivities = (events: EventSelect[]) => {
    const activities: ActivityType[] = [];
    for(const event of events) {
        const parsedEvent = eventSchema.parse(event);
        switch(parsedEvent.type) {
            case 'collection_item_added':
                activities.push({
                    src: 'https://avatars.githubusercontent.com/u/25245917?v=4',
                    alt: 'Friendship created',
                    date: event.createdAt,
                    title: 'Friendship created',
                    text: `You added ${parsedEvent.details.itemId} to your collection.`,
                });
                break;
        }
    }
    return activities;
}