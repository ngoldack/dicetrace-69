import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { user } = await parent();
	redirect(302, `/collection/${user.id}`);
};
