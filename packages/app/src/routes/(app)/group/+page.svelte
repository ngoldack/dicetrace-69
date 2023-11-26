<script>
	import CreateGroup from './create-group.svelte';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data;
</script>

<div class="flex items-center justify-between space-y-2">
	<h2 class="text-3xl font-bold tracking-tight">Your Groups</h2>
	<CreateGroup inputForm={data.form} />
</div>

<div class="grid gap-[1rem] sm:grid-cols-2 md:grid-cols-3">
	{#await data.groups}
		<p>Loading...</p>
	{:then items}
		{#each items as item}
			<Card.Root class="">
				<Card.Header>
					{item.groups.name}
				</Card.Header>

				<Card.Footer>
					<Button href={`/group/${item.groups.id}`} variant="default">View</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</div>
