<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { superForm as superFormFn } from 'sveltekit-superforms/client';

	import * as Tabs from '$lib/components/ui/tabs';
	import { dev } from '$app/environment';
	import { helloSchema } from './index.js';

	export let data;
	const superForm = superFormFn(data.form);
	const { submitting } = superForm;

	let current: string = 'basic';
</script>

<div class="flex flex-col items-center gap-4 p-2">
	<div class="flex flex-col items-center justify-center">
		<h1 class="text-2xl font-semibold">Create Account</h1>
		<p class="text-sm text-gray-500">Create an account to start tracking your collection.</p>
	</div>
	<div class="max-w-xl">
		<Form.Root
			method="POST"
			debug={dev}
			controlled
			form={superForm}
			schema={helloSchema}
			let:config
		>
			<Tabs.Root bind:value={current}>
				<Tabs.List class="grid w-full grid-cols-4">
					<Tabs.Trigger value="basic">Basic</Tabs.Trigger>
					<Tabs.Trigger value="bgg">BoardGameGeek</Tabs.Trigger>
					<Tabs.Trigger value="plan">Plan</Tabs.Trigger>
					<Tabs.Trigger value="overview">Finish</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="basic">
					<Card.Root>
						<Card.Header>
							<Card.Title>Basic Information</Card.Title>
							<Card.Description>
								This is your basic information. This is what will be displayed to other users.
							</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-2">
							<Form.Field {config} name="name">
								<Form.Item>
									<Form.Label>Name</Form.Label>
									<Form.Input />
									<Form.Description>This is your public display name.</Form.Description>
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</Card.Content>
						<Card.Footer class="flex justify-between">
							<Form.Button type="button" disabled>Previous</Form.Button>
							<Form.Button type="button" on:click={() => (current = 'bgg')}>Next</Form.Button>
						</Card.Footer>
					</Card.Root>
				</Tabs.Content>
				<Tabs.Content value="bgg">
					<Card.Root>
						<Card.Header>
							<Card.Title>BoardGameGeek Information</Card.Title>
							<Card.Description>
								In order to use this application, you must have a
								<a
									href="https://boardgamegeek.com"
									class="underline underline-offset-4 hover:text-primary"
								>
									account
								</a>
								.
								<p>This is used to sync your collection and plays.</p>
							</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-2">
							<Form.Field {config} name="bgg_username">
								<Form.Item>
									<Form.Label>BGG Username</Form.Label>
									<Form.Input />
									<Form.Description>This is BoardGameGeek username</Form.Description>
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</Card.Content>
						<Card.Footer class="flex justify-between">
							<Form.Button type="button" on:click={() => (current = 'basic')}>Previous</Form.Button>
							<Form.Button type="button" on:click={() => (current = 'plan')}>Next</Form.Button>
						</Card.Footer>
					</Card.Root>
				</Tabs.Content>

				<Tabs.Content value="plan">
					<Card.Root>
						<Card.Header>
							<Card.Title>Plan selection</Card.Title>
							<Card.Description>Select the plan that best fits your needs.</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-2">TODO Stripe Plan</Card.Content>
						<Card.Footer class="flex justify-between">
							<Form.Button type="button" on:click={() => (current = 'bgg')}>Previous</Form.Button>
							<Form.Button type="button" on:click={() => (current = 'overview')}>Next</Form.Button>
						</Card.Footer>
					</Card.Root>
				</Tabs.Content>
				<Tabs.Content value="overview">
					<Card.Root>
						<Card.Header>
							<Card.Title>Finish onboarding</Card.Title>
							<Card.Description>
								By clicking submit, you agree to our
								<a href="/terms" class="underline underline-offset-4 hover:text-primary">
									Terms of Service
								</a>
								and
								<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
									Privacy Policy
								</a>
								.
							</Card.Description>
						</Card.Header>
						<Card.Footer class="flex justify-between">
							<Form.Button type="button" on:click={() => (current = 'plan')}>Previous</Form.Button>
							<Form.Button type="submit" disabled={$submitting}>Submit</Form.Button>
						</Card.Footer>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</Form.Root>
	</div>
</div>
