<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { item as itemTable } from '$lib/db/schemas/item.schema';
	import type { collection as collectionTable } from '$lib/db/schemas/collection.schema';
	import type { users as userTable } from '$lib/db/schemas/user.schema';

	export let item: typeof itemTable.$inferSelect;
	export let collection: typeof collectionTable.$inferSelect | undefined;
	export let user: typeof userTable.$inferSelect | undefined;
</script>

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title>{item.id}</Card.Title>
		<Card.Description>Deploy your new project in one-click.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="name">Name</Label>
					<Input id="name" placeholder="Name of your project" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="framework">Framework</Label>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<Button variant="outline">Cancel</Button>
		<Button>Deploy</Button>
	</Card.Footer>
</Card.Root>
