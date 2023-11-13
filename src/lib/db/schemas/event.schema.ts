import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { idColumn, defaultColumns } from "../default";
import { user } from "./user.schema";
import type { Event, EventType } from "$lib/schemas/event";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type z from "zod";

export const event = sqliteTable('events', {
    id: idColumn,
    ...defaultColumns,

    userId: text('user_id').references(() => user.id).notNull(),
    type: text('type', {
        length: 255
    }).$type<EventType>().notNull(),
    details: text('details', {
        mode: 'json'
    }).$type<Event>().notNull(),
});

export const eventInsertSchema = createInsertSchema(event);
export const EventInsertSchema = typeof eventInsertSchema;
export type EventInsert = z.infer<typeof eventInsertSchema>;

export const eventSelectSchema = createSelectSchema(event);
export const EventSelectSchema = typeof eventSelectSchema;
export type EventSelect = z.infer<typeof eventSelectSchema>;