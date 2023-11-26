<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import AddEventItem from './add-event-item.svelte';
	import ItemTable from './item-table.svelte';

	export let data;
</script>

<div class="flex items-center justify-between space-y-2">
	<h2 class="text-3xl font-bold tracking-tight">Event</h2>

	<div class="flex">
		<a href="/group/{data.event?.groupId}">
			<Button variant="outline">Open Group</Button>
		</a>
	</div>
</div>

<AddEventItem inputForm={data.createForm} items={data.items.map((d) => d.item)} />
<ItemTable data={data.eventItems} votes={data.votes} userId={data.user.id} users={data.users} />
