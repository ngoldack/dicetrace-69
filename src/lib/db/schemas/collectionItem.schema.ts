import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { idColumn, defaultColumns } from "../default";
import { item } from "./item.schema";
import { collection } from "./collection.schema";

export const collectionItem = sqliteTable('collection_item', {
    id: idColumn,
    ...defaultColumns,

    itemId: text('item_id').references(() => item.id).notNull(),
    collectionId: text('collection_id').references(() => collection.id).notNull(),
});