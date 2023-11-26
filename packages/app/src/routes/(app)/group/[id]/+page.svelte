<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import InviteIcon from '~icons/lucide/mail-plus';
	import CreateEvent from './create-event.svelte';

	export let data;
</script>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-bold">{data.group?.name}</h1>
		<p class="text-gray-500">Group page</p>
	</div>
	<div>
		<a href="/group/{data.group?.id}/collection">
			<Button variant="secondary">View Collection</Button>
		</a>
		<a href="/group/{data.group?.id}/settings">
			<Button>Settings</Button>
		</a>
	</div>
</div>
<div class="col-span-3">
	<h2 class="text-xl font-bold">Description</h2>
	<p>
		Consequat qui ad deserunt ullamco commodo id sit sunt officia. Consequat cupidatat amet aliqua
		laboris nulla eiusmod sint esse sit do occaecat ea tempor nisi. Laborum id dolore cupidatat
		excepteur sunt cillum pariatur culpa consequat culpa consectetur. Ex eu tempor proident eu
		nostrud sint cupidatat consequat laboris cupidatat.
	</p>
</div>
<div class="flex gap-4">
	<div class="w-full">
		<h2 class="text-xl font-bold">Activity</h2>
	</div>
	<div class="w-fit">
		<Separator orientation="vertical" />
	</div>
	<div class="xs:flex-col flex w-[40%] gap-4 md:flex-col">
		<div>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold">Events</h2>
				<CreateEvent inputForm={data.form} />
			</div>

			<div class="flex flex-col gap-2 pt-2">
				{#each data.events as { event, participant, isInPast }}
					<div class="flex items-center gap-2 rounded-xl border p-2">
						<div class="flex w-full flex-col gap-2">
							<div class="flex justify-between">
								<div class="flex items-center justify-between gap-2">
									<span class="text-foreground">{event.name}</span>

									{#if participant?.type === 'host'}
										<Badge class="h-4">Host</Badge>
									{/if}
									{#if isInPast}
										<Badge variant="destructive" class="h-4">Ended</Badge>
									{/if}
								</div>

								{#if participant}
									<Badge class="h-4">Joined</Badge>
								{:else}
									<form action="/event/{event.id}?/join" method="POST">
										<Button type="submit" variant="secondary" class="h-4">Join</Button>
									</form>
								{/if}
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">Scheduled for: </span>
								<span class="text-foreground">
									{event.beginAt.toLocaleString()}
								</span>
							</div>
							<a href="/event/{event.id}">
								<Button size="sm" class="h-5 w-full" variant="secondary">View Event</Button>
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold">Members</h2>
				<Button class="h-6 w-28">
					<InviteIcon class="mr-2" />
					Invite
				</Button>
			</div>
			<ul class="flex flex-col gap-2 pt-2">
				{#each data.members as member}
					<li class="flex items-center gap-2 rounded-xl border p-2">
						<img
							src={member.user.avatar}
							alt="avatar"
							class="h-12 w-12 rounded-full object-cover"
						/>

						<div class="flexflex-col w-full gap-2">
							<div class="flex justify-between">
								<div class="flex items-center justify-center gap-2">
									<span class="text-foreground">{member.user.name}</span>
									{#if member.user.id === data.user.id}
										<Badge class="h-4">You</Badge>
									{:else}
										<Badge variant="secondary" class="h-4">Follow</Badge>
									{/if}
								</div>
								<Badge>{member.membership.role}</Badge>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">Member since:</span>
								<span class="text-foreground">
									{member.membership.createdAt.toLocaleDateString()}
								</span>
							</div>
							<a href="/profile/{member.user.id}">
								<Button size="sm" class="h-5 w-full" variant="secondary">View Profile</Button>
							</a>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
