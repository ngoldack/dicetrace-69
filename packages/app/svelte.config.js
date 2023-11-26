import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	paths: { relative: true },
	kit: {
		adapter: adapter({
			maxDuration: 5 * 60,
			runtime: 'nodejs20.x'
		})
	}
};

export default config;
