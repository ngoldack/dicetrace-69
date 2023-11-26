import type { BggBoardgameItem } from 'bgg-xml-api-client';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { defaultColumns, idColumn } from '../default';

export type ItemType = 'boardgame' | 'boardgameexpansion';

export const item = sqliteTable('item', {
	id: idColumn,
	...defaultColumns,

	name: text('name').notNull(),
	description: text('description').notNull(),
	image: text('image').notNull(),
	thumbnail: text('thumbnail').notNull(),
	yearPublished: integer('year_published').notNull(),
	minPlayers: integer('min_players').notNull(),
	maxPlayers: integer('max_players').notNull(),
	avgPlaytime: integer('avg_playtime').notNull(),
	minAge: integer('min_age').notNull(),

	bggId: integer('bgg_id').unique().notNull(),

	rating: integer('rating').notNull(),
	weight: integer('weight').notNull(),

	type: text('type').$type<ItemType>().notNull(),

	raw: text('raw', {
		mode: 'json'
	})
		.notNull()
		.$type<BggBoardgameItem>()
});
