<script lang="ts">
	import '../app.postcss';
	import { env } from '$env/dynamic/public';
	import { browser, dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import type { Metadata } from 'highlight.run/dist/client/src/types/types';
	import { H } from 'highlight.run';

	export let data;
	const { session } = data;

	if (browser && session?.user) {
		const metadata: Metadata = {};
		if (session.user.email) {
			metadata.email = session.user.email;
		}

		H.identify(session.user.id, metadata);
	}

	if (!env.PUBLIC_DISABLE_ANALYTICS) {
		inject({ mode: dev ? 'development' : 'production' });
	}
</script>

<slot />
