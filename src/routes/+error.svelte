<script lang="ts">
	import { Section, Page404 } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
	import { page } from '$app/stores';

	const error = $page.error;
</script>

<Section name="page500">
	<Page404>
		<svelte:fragment slot="h1">{error?.code ?? 500}</svelte:fragment>
		<svelte:fragment slot="paragraph">
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
				{error?.message ?? 'An unexpected error occurred. We are working on it.'}
			</p>
			<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
				{error?.detail ?? 'The page you are looking for was not found.'}
			</p>
			<Button href="/" size="lg" color="red">Back to Homepage</Button>
		</svelte:fragment>
	</Page404>
</Section>
