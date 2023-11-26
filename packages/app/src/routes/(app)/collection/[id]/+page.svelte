<script lang="ts">
	import { offset } from '@floating-ui/dom';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { page } from '$app/stores';

	import SyncingIcon from '~icons/lucide/loader2';
	import SyncIcon from '~icons/lucide/download-cloud';
	import BGGIcon from '~icons/simple-icons/boardgamegeek';
	import { toast } from 'svoast';
	import AspectRatio from '$lib/components/ui/aspect-ratio/aspect-ratio.svelte';

	export let data;
	let syncing = false;

	const syncBgg = async () => {
		syncing = true;
		const resp = await fetch(`/api/collection/sync`);
		if (!resp.ok) {
			toast.error('Failed to sync with BGG.');
			syncing = false;
			return;
		}
		toast.success('Synced with BGG.');
		syncing = false;
	};

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	const collectionsEnabled = $page.url.searchParams.getAll('collection');
	const collections = [
		...new Map(data.collection.map((x) => x.collection).map((item) => [item['id'], item])).values()
	].map((collection) => {
		return {
			...collection,
			enabled: collectionsEnabled.length > 0 ? collectionsEnabled.includes(collection.id) : true
		};
	});
</script>

<div class="flex items-center justify-between space-y-2">
	<h2 class="text-3xl font-bold tracking-tight">
		{#if data.user.id === $page.params.id}
			Your
		{:else}
			{data.user.name}'s
		{/if}
		Collection
	</h2>
	<Button
		id="bgg_sync_btn"
		disabled={!data.user.bgg_username || syncing}
		variant="outline"
		on:click={syncBgg}
	>
		{#if syncing}
			<SyncingIcon class="h4 mr-2 w-4 animate-spin" />
		{:else}
			<SyncIcon class="mr-2 h-4 w-4" />
		{/if}
		Sync now with
		<BGGIcon class="ml-1 h-4 w-4" />
	</Button>
</div>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]}>
			{collections.filter((c) => c.enabled).length} collection selected
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>Show Collections</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each collections as collection}
			<DropdownMenu.CheckboxItem bind:checked={collection.enabled}>
				<div class="flex flex-col">
					<span class="text-foreground">{collection.name}</span>
					<span class="text-muted-foreground text-xs">{collection.id}</span>
				</div>
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>

<div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
	{#await data.collection}
		<p>Loading...</p>
	{:then items}
		{#each items as { item }}
			<Card.Root class="">
				<Card.Header>
					<AspectRatio ratio={1}>
						<img src={item.image} alt={item.name} class="h-full w-full object-cover" />
					</AspectRatio>
					<Card.Title>{item.name}</Card.Title>
					<Card.Description></Card.Description>
				</Card.Header>
				<Card.Content></Card.Content>
			</Card.Root>
		{/each}
	{/await}
</div>
