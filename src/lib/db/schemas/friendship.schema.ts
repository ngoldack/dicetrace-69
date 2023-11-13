import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { idColumn, defaultColumns } from "../default";
import { user } from "./user.schema";

export const friendship = sqliteTable(
	'friendship',
	{
		id: idColumn,
		...defaultColumns,

		user1: text('user_1')
			.notNull()
			.references(() => user.id),
		user2: text('user_2')
			.notNull()
			.references(() => user.id),
	},
	(t) => ({
		befriend_way_1: unique().on(t.user1, t.user2),
		befriend_way_2: unique().on(t.user2, t.user1),
	})
);
