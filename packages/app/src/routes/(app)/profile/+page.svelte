<script lang="ts">
	import EditProfile from './edit-profile.svelte';

	export let data;
</script>

<div class="flex items-center justify-between space-y-2">
	<h2 class="text-3xl font-bold tracking-tight">Your Profile</h2>
	<EditProfile inputForm={data.form} />
</div>

<pre>{JSON.stringify(data, null, 2)}</pre>
