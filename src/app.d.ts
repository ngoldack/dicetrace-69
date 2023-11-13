// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User } from '$lib/db/schemas/user.schema';
import type { Error as E } from '$lib/schemas/error';
import 'unplugin-icons/types/svelte';

declare global {
	namespace App {
		interface Error extends E {}
		interface Locals {
			user?: User;
			messages?: string[];
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
