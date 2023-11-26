<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import type { User } from '$lib/db/schemas/user.schema';
	import { signOut as singOutAuth } from '@auth/sveltekit/client';
	import { QuestionMark } from 'radix-icons-svelte';

	const signOut = async () => {
		await singOutAuth({
			callbackUrl: '/'
		});
	};

	export let userdata: User;
</script>

<DropdownMenu.Root positioning={{ placement: 'bottom-end' }}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<Avatar.Image src={userdata.avatar} alt="{userdata.name} avatar" />
				<Avatar.Fallback>
					<QuestionMark />
				</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{userdata.name}</p>
				<p class="text-xs leading-none text-muted-foreground">{userdata.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item href="/profile">Profile</DropdownMenu.Item>
			<DropdownMenu.Item>Billing</DropdownMenu.Item>
			<DropdownMenu.Item href="/settings">Settings</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={signOut}>Log out</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
