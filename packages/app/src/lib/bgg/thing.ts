import { z } from 'zod';

const gameLinkSchema = z.object({
	type: z.string(),
	id: z.number(),
	value: z.string()
});

const pollResultSchema = z.object({
	value: z.union([z.string(), z.number()]),
	numvotes: z.number()
});

const pollResultsSchema = z.object({
	result: z.array(pollResultSchema),
	numplayers: z.union([z.string(), z.number()])
});

const pollSchema = z.object({
	results: z.array(pollResultsSchema),
	name: z.string(),
	title: z.string(),
	totalvotes: z.number()
});

const nameSchema = z.object({
	type: z.string(),
	sortindex: z.number(),
	value: z.string()
});

const basicValueSchema = z.object({
	value: z.union([z.number(), z.string()])
});

export const boardGameSchema = z.object({
	thumbnail: z.string(),
	image: z.string(),
	name: z.array(nameSchema),
	description: z.string(),
	yearpublished: basicValueSchema,
	minplayers: basicValueSchema,
	maxplayers: basicValueSchema,
	poll: z.array(pollSchema),
	playingtime: basicValueSchema,
	minplaytime: basicValueSchema,
	maxplaytime: basicValueSchema,
	minage: basicValueSchema,
	link: z.array(gameLinkSchema),
	type: z.string(),
	id: z.number()
});
