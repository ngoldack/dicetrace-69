import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { idColumn, defaultColumns } from '../default';

export const item = sqliteTable('item', {
	id: idColumn,
	...defaultColumns,

	bggId: integer('bgg_id').unique(),
	raw: text('raw', {
		mode: 'json',
	})
});
