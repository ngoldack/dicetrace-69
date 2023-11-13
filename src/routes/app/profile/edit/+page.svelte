<script lang="ts">
	import { Section } from 'flowbite-svelte-blocks';
	import { Label, Input, Button, Spinner } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svoast';

	export let data;

	const { form, enhance, submitting } = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.status === 204) {
				toast.success('Updated your profile.');
			}
		}
	});
</script>

<Section name="crudcreateform">
	<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Profile</h2>
	<form method="post" use:enhance>
		<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
			<div class="sm:col-span-2">
				<Label for="name" class="mb-2">Name</Label>
				<Input type="text" id="name" name="name" placeholder="John Doe" bind:value={$form.name} />
			</div>
			<div class="sm:col-span-2">
				<Label for="email" class="mb-2">Email</Label>
				<Input
					type="email"
					name="email"
					id="email"
					placeholder="mail@example.com"
					disabled
					required
					bind:value={$form.email}
				/>
				<Label for="email" class="mt-2">Please contact support to change your email.</Label>
			</div>
			<Button type="submit" class="w-40" disabled={$submitting}>
				{#if $submitting}
					<Spinner size={'4'} class="mr-2" />
				{/if}
				Update profile
			</Button>
		</div>
	</form>
</Section>
