<script lang="ts">
	import { signOut as singOutAuth } from '@auth/sveltekit/client';
	import {
		Navbar,
		NavBrand,
		NavHamburger,
		NavUl,
		NavLi,
		Avatar,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider
	} from 'flowbite-svelte';

	export let data;

	const signOut = async () => {
		await singOutAuth({
			callbackUrl: '/?message=signout'
		});
	};
</script>

<header>
	<Navbar let:NavContainer>
		<NavContainer class="border px-5 py-2 rounded-lg bg-white dark:bg-gray-600">
			<NavBrand href="/">
				<!-- <img
					src="/images/flowbite-svelte-icon-logo.svg"
					class="mr-3 h-6 sm:h-9"
					alt="Flowbite Logo"
				/> -->
				<span class="self-center whitespace-nowrap text-xl font-semibold">dicetrace</span>
			</NavBrand>
			<NavHamburger />
			<NavUl>
				<NavLi href="/app">Dashboard</NavLi>
				<NavLi href="/search">Search</NavLi>
			</NavUl>
			<Avatar
				id="user-drop"
				src={data.user.avatar}
				class="cursor-pointer"
				dot={{ color: 'green' }}
			/>
			<Dropdown triggeredBy="#user-drop" data-placement="bottom-end">
				<DropdownHeader>
					{#if data.user.name}<span class="block text-sm">{data.user.name}</span>{/if}
					<span class="block truncate text-sm font-medium">{data.user.email}</span>
				</DropdownHeader>
				<a href="/app/profile"><DropdownItem>Profile</DropdownItem></a>
				<DropdownItem>Settings</DropdownItem>
				<DropdownDivider />
				<DropdownItem on:click={signOut}>Sign out</DropdownItem>
			</Dropdown>
		</NavContainer>
	</Navbar>
</header>

<slot />
