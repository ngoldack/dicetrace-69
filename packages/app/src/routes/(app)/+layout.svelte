<script lang="ts">
	import MainNav from './main-nav.svelte';
	import CommandInput from './command-input.svelte';
	import UserNav from './user-nav.svelte';

	export let data;
</script>

<div class="hidden flex-col md:flex">
	<div class="border-b">
		<div class="flex h-16 items-center px-4">
			<MainNav class="mx-6" />
			<div class="ml-auto flex items-center space-x-4">
				<CommandInput />
				<UserNav userdata={data.user} />
			</div>
		</div>
	</div>
	<div class="flex-1 space-y-4 p-8 pt-6">
		<slot />
	</div>
</div>
