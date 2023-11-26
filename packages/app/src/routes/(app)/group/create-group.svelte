<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { superForm as superFormFn } from 'sveltekit-superforms/client';

	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { groupInsertSchema, type GroupInsertSchema } from '$lib/db/schemas/group.schema';
	import PlusIcon from '~icons/lucide/plus';

	export let inputForm: SuperValidated<GroupInsertSchema>;

	let open = false;
	const superForm = superFormFn(inputForm);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
		<PlusIcon class="mr-2 h-4 w-4" />
		Create group
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Form.Root method="POST" controlled form={superForm} schema={groupInsertSchema} let:config>
			<Dialog.Header>
				<Dialog.Title>Create a new group</Dialog.Title>
				<Dialog.Description>
					You can create a new group here. Click create when you're done.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<Form.Field {config} name="name">
					<Form.Item>
						<Form.Label>Name</Form.Label>
						<Form.Input />
						<Form.Description>This is the public name of your new group.</Form.Description>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</div>
			<Dialog.Footer>
				<Form.Button>Create</Form.Button>
				<Form.Button variant="outline" type="button" on:click={() => (open = false)}>
					Cancel
				</Form.Button>
			</Dialog.Footer>
		</Form.Root>
	</Dialog.Content>
</Dialog.Root>
