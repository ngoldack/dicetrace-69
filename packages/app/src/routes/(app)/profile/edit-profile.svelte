<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { updateUserSchema } from '$lib/db/schemas/user.schema';
	import { superForm as superFormFn } from 'sveltekit-superforms/client';
	import { toast } from 'svoast';

	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/components/ui/button/button.svelte';
	import ShuffleIcon from '~icons/lucide/shuffle';
	import UploadIcon from '~icons/lucide/upload';
	import * as Avatar from '$lib/components/ui/avatar';
	import { QuestionMark } from 'radix-icons-svelte';
	import { nanoid } from 'nanoid';

	export let inputForm: SuperValidated<typeof updateUserSchema>;

	let open = false;
	const superForm = superFormFn(inputForm, {
		onResult: async ({ result }) => {
			if (result.status === 200) {
				open = false;
				toast.success('Updated your profile.');
			}
			console.log(result);
		}
	});

	const { form } = superForm;
	const randomAvatar = () => {
		$form.avatar = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${nanoid()}`;
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Edit Profile</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Form.Root method="POST" controlled form={superForm} schema={updateUserSchema} let:config>
			<Dialog.Header>
				<Dialog.Title>Edit profile</Dialog.Title>
				<Dialog.Description>
					Make changes to your profile here. Click save when you're done.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<Form.Field {config} name="avatar">
					<Form.Item>
						<Form.Input type="hidden" />
						<Form.Label>Avatar</Form.Label>
						<div class="mb-1 flex w-full justify-center">
							<Avatar.Root class="h-24 w-24">
								<Avatar.Image src={$form.avatar} alt="{$form.name} avatar" />
								<Avatar.Fallback>
									<QuestionMark />
								</Avatar.Fallback>
							</Avatar.Root>
						</div>
						<div class="flex w-full justify-center gap-2">
							<Button disabled class="w-32" variant="default" type="button" on:click={randomAvatar}>
								<UploadIcon class="mr-1 h-4 w-4" /> Upload
							</Button>
							<Button class="w-32" variant="outline" type="button" on:click={randomAvatar}>
								<ShuffleIcon class="mr-1 h-4 w-4" /> Randomize
							</Button>
						</div>
						<Form.Description>Upload a new avatar.</Form.Description>
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="name">
					<Form.Item>
						<Form.Label>Name</Form.Label>
						<Form.Input />
						<Form.Description>This is your public display name.</Form.Description>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="bgg_username">
					<Form.Item>
						<Form.Label>Boardgamegeek username</Form.Label>
						<Form.Input />
						<Form.Description>
							Enter your boardgamegeek username. This is required for syncing your collection
						</Form.Description>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="email">
					<Form.Item>
						<Form.Label>Email</Form.Label>
						<Form.Input disabled />
						<Form.Description>Please contact the support to change your email.</Form.Description>
					</Form.Item>
				</Form.Field>
			</div>
			<Dialog.Footer>
				<Form.Button>Save</Form.Button>
				<Form.Button variant="outline" type="button" on:click={() => (open = false)}
					>Cancel</Form.Button
				>
			</Dialog.Footer>
		</Form.Root>
	</Dialog.Content>
</Dialog.Root>
