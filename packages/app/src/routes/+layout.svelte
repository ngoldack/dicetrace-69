<script lang="ts">
	import '../app.postcss';
	import { env } from '$env/dynamic/public';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { ModeWatcher } from 'mode-watcher';

	if (!env.PUBLIC_DISABLE_ANALYTICS) {
		inject({ mode: dev ? 'development' : 'production' });
	}
</script>

<div class="container mx-auto">
	<slot />
</div>

<ModeWatcher />
