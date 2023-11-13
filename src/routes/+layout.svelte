<script lang="ts">
	import '../app.postcss';
	import { env } from '$env/dynamic/public';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Message from '$lib/components/message.svelte';
	import { Toasts } from 'svoast';


	if (!env.PUBLIC_DISABLE_ANALYTICS) {
		inject({ mode: dev ? 'development' : 'production' });
	}

	export let data;

	onMount(async () => {
		$page.url.searchParams.delete('message');
		await goto($page.url);
	});
</script>

<div class="container mx-auto">
	<slot />
</div>

{#if data.messages}
	<div class="fixed flex flex-row-reverse items-center w-64 bottom-4 right-4">
		<div class="flex flex-col gap-2">
			{#each data.messages as message}
				<Message {message} />
			{/each}
		</div>
	</div>
{/if}

<Toasts />