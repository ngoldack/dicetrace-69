<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils';
	import { signIn } from '@auth/sveltekit/client';
	import SpinnerIcon from '~icons/lucide/loader2';

	let className: string | undefined | null = undefined;
	export { className as class };

	export let isLoading: boolean;

	const authenticate = async () => {
		isLoading = true;

		const redirectPath = $page.url.searchParams.get('redirect') || '/';
		await signIn('passage', {
			callbackUrl: redirectPath
		});
	};
</script>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<Button variant="outline" type="button" disabled={isLoading} on:click={authenticate}>
		{#if isLoading}
			<SpinnerIcon class="mr-2 h-4 w-4 animate-spin" />
		{:else}
			<img
				src="https://authjs.dev/img/providers/passage.svg"
				class="mr-2 h-4 w-4"
				alt="passage icon"
			/>
		{/if}
		Passage
	</Button>
</div>
