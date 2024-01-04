import { getBggSearch, getBggThing } from 'bgg-xml-api-client';

export const GET = async ({ url }) => {
	const query = url.searchParams.get('q');
	if (!query) return new Response('Missing query', { status: 400 });

	const queryResults = await getBggSearch({
		query,
		type: 'boardgame'
	});

	const ids = queryResults.item.map((item) => item.id);
	const games = await getBggThing({
		id: ids,
		type: 'boardgame'
	});

	return new Response(JSON.stringify({ query, games }), { status: 200 });
};
