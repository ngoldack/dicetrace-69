<script lang="ts">
	import '../app.postcss';
	import { env } from '$env/dynamic/public';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	if (!env.PUBLIC_DISABLE_ANALYTICS) {
		inject({ mode: dev ? 'development' : 'production' });
	}
</script>

<slot />
