<script lang="ts" context="module">
	import NotificationBellIcon from '~icons/lucide/bell';
	import NotificationBellRingIcon from '~icons/lucide/bell-ring';

	const notifications = readable<NotificationSelect[]>([]);
</script>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { NotificationStatus, type NotificationSelect } from '$lib/db/schemas/notification.schema';
	import { readable } from 'svelte/store';
</script>

<Popover.Root>
	<Popover.Trigger>
		{#if $notifications.filter((notification) => notification.status === NotificationStatus.Unread).length > 0}
			<NotificationBellRingIcon class="h-6 w-6" />
		{:else}
			<NotificationBellIcon class="h-6 w-6" />
		{/if}
	</Popover.Trigger>
	<Popover.Content>
		<Card.Header>
			<Card.Title>Notification Center</Card.Title>
			<Card.Description>Manage your notifications here</Card.Description>
		</Card.Header>
		<Card.Content>
			<ul>
				{#if $notifications.length === 0}
					<li>No notifications</li>
				{/if}
				{#each $notifications as notification}
					<li>{notification.id}</li>
				{/each}
			</ul>
		</Card.Content>
	</Popover.Content>
</Popover.Root>
