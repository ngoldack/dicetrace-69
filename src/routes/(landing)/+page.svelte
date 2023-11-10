<script lang="ts">
	import { Section, News, HeroHeader } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
	import VideoSolid from '~icons/lucide/video';
</script>

<Section name="heroDefault">
	<News>
		<span class="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
		<span class="text-sm font-medium">Flowbite is out! See what's new</span>
	</News>
	<HeroHeader>
		<svelte:fragment slot="h1">We invest in the world’s potential</svelte:fragment>
		<svelte:fragment slot="paragraph"
			>Here at Flowbite we focus on markets where technology, innovation, and capital can unlock
			long-term value and drive economic growth.</svelte:fragment
		>
	</HeroHeader>

	<div
		class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
	>
		<a href="/app">
			<Button size="lg" color="red">Open the app</Button>
		</a>
		<a href="/">
			<Button size="lg" color="light">
				<VideoSolid class="mr-2 -ml-1" />
				Watch video
			</Button>
		</a>
	</div>
</Section>
