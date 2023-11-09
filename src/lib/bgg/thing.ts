import { z } from 'zod';

const PlayerPollResultSchema = z.object({
	value: z.string(),
	numvotes: z.number()
});

const PollResultSchema = z.object({
	result: z.array(PlayerPollResultSchema),
	numplayers: z.union([z.string(), z.number()])
});

const PollSchema = z.object({
	results: z.union([z.array(PollResultSchema), PollResultSchema]),
	name: z.string(),
	title: z.string(),
	totalvotes: z.number()
});

const LinkSchema = z.object({
	type: z.string(),
	id: z.number(),
	value: z.string()
});

export const GameSchema = z.object({
	thumbnail: z.string().url(),
	image: z.string().url(),
	name: z.object({
		type: z.string(),
		sortindex: z.number(),
		value: z.string()
	}),
	description: z.string(),
	yearpublished: z.object({
		value: z.number()
	}),
	minplayers: z.object({
		value: z.number()
	}),
	maxplayers: z.object({
		value: z.number()
	}),
	poll: z.array(PollSchema),
	playingtime: z.object({
		value: z.number().nonnegative()
	}),
	minplaytime: z.object({
		value: z.number().nonnegative()
	}),
	maxplaytime: z.object({
		value: z.number().nonnegative()
	}),
	minage: z.object({
		value: z.number().positive()
	}),
	link: z.array(LinkSchema),
	type: z.string(),
	id: z.number()
});
