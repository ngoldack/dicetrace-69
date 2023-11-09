// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Error as E } from '$lib/schemas/error';
import 'unplugin-icons/types/svelte';

declare global {
	namespace App {
		interface Error extends E {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
