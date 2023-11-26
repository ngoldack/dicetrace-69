import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { defaultColumns, idColumn } from '../default';
import { collection } from './collection.schema';
import { item } from './item.schema';

export const collectionItem = sqliteTable('collection_item', {
	id: idColumn,
	...defaultColumns,

	itemId: text('item_id')
		.references(() => item.id)
		.notNull(),
	collectionId: text('collection_id')
		.references(() => collection.id)
		.notNull()
});
