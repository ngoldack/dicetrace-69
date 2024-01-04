<script lang="ts">
	import ItemCollectionCard from '$lib/components/custom/item/item-collection-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import BackIcon from '~icons/lucide/arrow-left';

	export let data;
</script>

<div class="flex items-center justify-between space-y-2">
	<h2 class="text-3xl font-bold tracking-tight text-muted-foreground">
		Collection of
		<span class="text-foreground">{data.group?.name}</span>
	</h2>
	<div class="flex">
		<a href="/group/{data.group?.id}">
			<Button variant="outline">
				<BackIcon class="mr-2 h-4 w-4" />
				Back
			</Button>
		</a>
	</div>
</div>

<div class="grid grid-cols-3 gap-2">
	{#each data.items as { item, user, collection }, index (index)}
		<div>
			<ItemCollectionCard {item} {user} {collection} />
		</div>
	{/each}
</div>
