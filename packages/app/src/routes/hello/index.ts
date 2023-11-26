import { insertUserSchema } from '$lib/db/schemas/user.schema';

export const helloSchema = insertUserSchema.pick({
	name: true,
	bgg_username: true
});
