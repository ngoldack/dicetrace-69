<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import * as Form from '$lib/components/ui/form';
	import { eventItemInsertSchema, type EventItemInsertSchema } from '$lib/db/schemas/event.schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm as superFormFn } from 'sveltekit-superforms/client';
	import { tick } from 'svelte';
	import { cn } from '$lib/utils';
	import type { item } from '$lib/db/schemas/item.schema';
	import SortIcon from '~icons/lucide/arrow-down-narrow-wide';
	import CheckIcon from '~icons/lucide/check';
	import { dev } from '$app/environment';
	import { createEventItemSchema, type CreateEventItemSchema } from '.';

	export let items: (typeof item.$inferSelect)[];
	export let inputForm: SuperValidated<CreateEventItemSchema>;
	export const superForm = superFormFn(inputForm);

	let open = false;
	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="outline">Add Item</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Form.Root
			method="POST"
			action="?/addItem"
			controlled
			form={superForm}
			debug={dev}
			schema={createEventItemSchema}
			let:config
		>
			<Dialog.Header>
				<Dialog.Title>Add item to event playlist</Dialog.Title>
				<Dialog.Description>
					This adds an item to the event playlist. Click add when you're done.
				</Dialog.Description>

				<div class="grid gap-4 py-4">
					<Form.Field {config} name="itemId" let:setValue let:value>
						<Form.Item>
							<Form.Label>Item</Form.Label>

							<Popover.Root bind:open let:ids>
								<Popover.Trigger asChild let:builder>
									<Form.Control id={ids.trigger} let:attrs>
										<Button
											{...attrs}
											builders={[builder]}
											variant="outline"
											role="combobox"
											class={cn('w-[200px] justify-between', !value && 'text-muted-foreground')}
										>
											{items.find((f) => f.id === value)?.name ?? 'Select item'}
											<SortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</Form.Control>
								</Popover.Trigger>
								<Popover.Content class="w-[200px] p-0">
									<Command.Root>
										<Command.Input autofocus placeholder="Search game..." class="h-9" />
										<Command.Empty>No game found.</Command.Empty>
										<Command.Group>
											{#each items as item}
												<Command.Item
													value={item.id}
													onSelect={() => {
														setValue(item.id);
														closeAndFocusTrigger(ids.trigger);
													}}
												>
													{item.name}
													<CheckIcon
														class={cn('ml-auto h-4 w-4', item.id !== value && 'text-transparent')}
													/>
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.Root>
								</Popover.Content>
							</Popover.Root>

							<Form.Description>Item that will be added.</Form.Description>
							<Form.Validation />
						</Form.Item>
					</Form.Field>
				</div>

				<Dialog.Footer>
					<Form.Button>Add</Form.Button>
				</Dialog.Footer>
			</Dialog.Header>
		</Form.Root>
	</Dialog.Content>
</Dialog.Root>
