<script lang="ts">
	import { onMount } from 'svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { Spinner } from 'flowbite-svelte';
	import { redirect } from '@sveltejs/kit';

	export let data;
	let loading = true;
	onMount(async () => {
		if (data.session) {
			throw redirect(303, '/app');
		}
		await signIn('passage', {
			callbackUrl: '/app',
			redirect: true
		});
		loading = false;
	});
</script>

<Spinner />
{#if loading}
	<p>Signing in...</p>
{:else}
	<p>Successfully signed in! Redirecting...</p>
{/if}
