import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { idColumn, defaultColumns } from "../default";
import { user } from "./user.schema";

export const collection = sqliteTable('collection', {
    id: idColumn,
    ...defaultColumns,

    userId: text('user_id').references(() => user.id).notNull(),
});