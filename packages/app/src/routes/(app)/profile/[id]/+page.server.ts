import { redirect } from '@sveltejs/kit';

export const load = async ({ params, parent }) => {
	const { user } = await parent();
	if (user.id === params.id) {
		throw redirect(302, '/profile');
	}
};
