import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],
	paths: { relative: false },
	kit: {
		adapter: adapter({
			runtime: 'edge'
		})
	}
};

export default config;
