import z from 'zod';

export const messageSchema = z.object({
	type: z.enum(['info', 'success', 'warning', 'error']).optional().default('info'),
	text: z.string(),

	hide: z.boolean().optional().default(true),
	hideAfter: z.number().optional().default(5),

	open: z.boolean().optional().default(true),
	dismissable: z.boolean().optional().default(true)
});

export type Message = z.infer<typeof messageSchema>;
