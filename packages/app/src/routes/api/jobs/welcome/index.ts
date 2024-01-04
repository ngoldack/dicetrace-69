import { z } from 'zod';

export const welcomeSchema = z.object({
	user_id: z.string()
});
