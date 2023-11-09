import { createId } from '@paralleldrive/cuid2';
import z from 'zod';

export const errorSchema = z.object({
	id: z
		.string()
		.cuid2()
		.default(() => createId()),
	code: z.string().optional(),
	message: z.string(),
	detail: z.string().optional(),
	stack: z.any()
});

export const ErrorSchema = typeof errorSchema;
export type Error = z.infer<typeof errorSchema>;
