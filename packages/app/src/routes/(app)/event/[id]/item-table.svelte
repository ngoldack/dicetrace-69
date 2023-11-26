<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { item } from '$lib/db/schemas/item.schema';
	import type { EventItemVoteType, eventItemVotes, eventItems } from '$lib/db/schemas/event.schema';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { invalidateAll } from '$app/navigation';
	import type { users as userTable } from '$lib/db/schemas/user.schema';

	import UpvoteIcon from '~icons/lucide/thumbs-up';
	import NeutralIcon from '~icons/lucide/help-circle';
	import DownvoteIcon from '~icons/lucide/thumbs-down';

	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { collection } from '$lib/db/schemas/collection.schema';
	import * as Avatar from '$lib/components/ui/avatar';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	export let data: {
		item: typeof item.$inferSelect;
		event_items: typeof eventItems.$inferSelect;
		event_item_votes: typeof eventItemVotes.$inferSelect | null;
		collection: typeof collection.$inferSelect;
	}[];
	export let votes: (typeof eventItemVotes.$inferSelect)[];
	export let users: (typeof userTable.$inferSelect)[];
	export let userId: string;

	const myVotes: Record<string, EventItemVoteType> = {};
	votes
		.filter((v) => v.userId === userId)
		.forEach((v) => {
			myVotes[v.eventItemId] = v.type;
		});

	const voted = async (eventItemId: string, type: EventItemVoteType | undefined) => {
		const body = new FormData();
		body.append('eventItemId', eventItemId);
		body.append('type', type as string);
		const resp = await fetch('?/vote', {
			method: 'POST',
			body
		});

		if (resp.ok) {
			await invalidateAll();
		}
	};
</script>

<Table.Root>
	<Table.Caption>Selected games</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="text-left">#</Table.Head>
			<Table.Head class="w-full">Item</Table.Head>
			<Table.Head class="max-w-0">Votes</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as { item, event_items, event_item_votes, collection }, index (index)}
			<Table.Row>
				<Table.Cell>{index + 1}</Table.Cell>
				<Table.Cell>
					<div class="flex gap-2">
						<div class="flex h-20 w-20 items-center justify-center">
							<img src={item.thumbnail} alt={item.name} class="self max-h-20" />
						</div>
						<Separator orientation="vertical" />
						<div class="flex flex-col gap-2">
							<span class="text-foreground text-xl">
								{item.name}
							</span>
							<div class="flex items-center gap-2">
								<span class="text-muted-foreground"> Owned by: </span>
								<div class="flex gap-2">
									{#each users.filter((u) => u.id === collection.userId) ?? [] as user}
										<Avatar.Root class="h-8 w-8">
											<Avatar.Image src={user.avatar} alt={user.name} />
											<Avatar.Fallback>NA</Avatar.Fallback>
										</Avatar.Root>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</Table.Cell>
				<Table.Cell>
					<div class="flex gap-2">
						<Button
							variant={myVotes[event_items.id] === 'upvote' ? 'default' : 'outline'}
							on:click={() => voted(event_items.id, 'upvote')}
						>
							<UpvoteIcon class="mr-2 h-4 w-4" />
							{votes.filter((v) => {
								return v.eventItemId === event_items.id && event_item_votes?.type === 'upvote';
							}).length}
						</Button>
						<Button
							variant={myVotes[event_items.id] === 'neutral' ? 'default' : 'outline'}
							on:click={() => voted(event_items.id, 'neutral')}
						>
							<NeutralIcon class="mr-2 h-4 w-4" />
							{votes.filter((v) => {
								return v.eventItemId === event_items.id && event_item_votes?.type === 'neutral';
							}).length}
						</Button>
						<Button
							variant={myVotes[event_items.id] === 'downvote' ? 'default' : 'outline'}
							on:click={() => voted(event_items.id, 'downvote')}
						>
							<DownvoteIcon class="mr-2 h-4 w-4" />
							{votes.filter((v) => {
								return v.eventItemId === event_items.id && event_item_votes?.type === 'downvote';
							}).length}
						</Button>
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
