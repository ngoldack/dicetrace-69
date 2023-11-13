<script lang="ts">
	import type { Message } from '$lib/schemas/message';
	import { Toast } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import InfoIcon from '~icons/lucide/info';
	import SuccessIcon from '~icons/lucide/check-circle';
	import WarningIcon from '~icons/lucide/alert-circle';
	import ErrorIcon from '~icons/lucide/alert-triangle';

	export let message: Message;
	let counter = 6;

	onMount(() => timeout());

	// @ts-expect-error - Ignore this error
	const timeout = async () => {
		if (--counter > 0) return setTimeout(timeout, 1000);
		message.open = false;
	};

	const getColor = (type: string) => {
		if (type === 'info') return 'blue';
		if (type === 'success') return 'green';
		if (type === 'warning') return 'orange';
		if (type === 'error') return 'red';
		return undefined;
	};
</script>

<Toast
	dismissable={message.dismissable}
	bind:open={message.open}
	color={getColor(message.type)}
	contentClass="flex space-x-4 divide-x divide-gray-200 dark:divide-gray-700"
>
	<div slot="icon" color="">
		{#if message.type === 'info'}
			<InfoIcon class="text-blue" />
		{:else if message.type === 'success'}
			<SuccessIcon class="w-6 h-6 mr-2 text-green" />
		{:else if message.type === 'warning'}
			<WarningIcon class="w-6 h-6 mr-2 text-orange" />
		{:else if message.type === 'error'}
			<ErrorIcon class="w-6 h-6 mr-2 text-red" />
		{/if}
	</div>
	<span>
		{message.text}
	</span>
</Toast>
