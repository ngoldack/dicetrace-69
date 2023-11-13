<script lang="ts">
	import { Activity, ActivityItem } from 'flowbite-svelte';

	export let data;
</script>

<a href="/app/profile/edit">Edit</a>

<div class="grid md:grid-cols-3 sm:col-span-1">
	<div class="col-span-2">
		{#if data.activities.length === 0}
			<pre>{JSON.stringify(data, null, 2)}</pre>
			<Activity>
				<ActivityItem activities={data.activities} />
			</Activity>
		{:else}
			<p>No activities yet.</p>
		{/if}
	</div>
	<div class="">t</div>
</div>
