CREATE TABLE `auth_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`user_id` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`provider` text NOT NULL,
	`type` text NOT NULL,
	`expires_at` integer,
	`expires_in` integer,
	`access_token` text,
	`id_token` text,
	`refresh_token` text,
	`scope` text,
	`token_type` text,
	`params` text
);
--> statement-breakpoint
CREATE TABLE `auth_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`token` text NOT NULL,
	`user_id` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `auth_users` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`email` text NOT NULL,
	`email_verified_at` integer,
	`name` text,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `auth_verification_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`expires` integer NOT NULL,
	`token` text NOT NULL,
	`is_used` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collection` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`name` text DEFAULT 'New Collection' NOT NULL,
	`user_id` text NOT NULL,
	`visibility` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `collection_item` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`item_id` text NOT NULL,
	`collection_id` text NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_item_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`event_item_id` text NOT NULL,
	`user_id` text NOT NULL,
	`vote` text NOT NULL,
	FOREIGN KEY (`event_item_id`) REFERENCES `event_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_items` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`event_id` text NOT NULL,
	`item` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`group_id` text NOT NULL,
	`visibility` text NOT NULL,
	`name` text NOT NULL,
	`begin_at` integer NOT NULL,
	`end_at` integer,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `friendship` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`user_1` text NOT NULL,
	`user_2` text NOT NULL,
	FOREIGN KEY (`user_1`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_2`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `group_members` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`role` text NOT NULL,
	`group_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`type` text NOT NULL,
	`for_id` text NOT NULL,
	`from_id` text NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`for_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`thumbnail` text NOT NULL,
	`year_published` integer NOT NULL,
	`min_players` integer NOT NULL,
	`max_players` integer NOT NULL,
	`avg_playtime` integer NOT NULL,
	`min_age` integer NOT NULL,
	`bgg_id` integer NOT NULL,
	`rating` integer NOT NULL,
	`weight` integer NOT NULL,
	`type` text NOT NULL,
	`raw` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `match_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`match_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `match_results` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`match_id` text NOT NULL,
	`user_id` text NOT NULL,
	`score` integer NOT NULL,
	`winner` integer NOT NULL,
	`blob` text,
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`item_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`ended_at` integer,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`user_id` text NOT NULL,
	`read_at` integer,
	`type` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`user_id` text NOT NULL,
	`item_id` text NOT NULL,
	`rating` integer NOT NULL,
	`text` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`type` text NOT NULL,
	`auth_id` text,
	`email` text NOT NULL,
	`bgg_username` text,
	`stripe_customer_id` text,
	`public` integer DEFAULT 1 NOT NULL,
	`name` text,
	`avatar` text NOT NULL,
	FOREIGN KEY (`auth_id`) REFERENCES `auth_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_accounts_provider_provider_account_id_unique` ON `auth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_verification_tokens_token_unique` ON `auth_verification_tokens` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `event_item_votes_event_item_id_user_id_unique` ON `event_item_votes` (`event_item_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `event_items_event_id_item_unique` ON `event_items` (`event_id`,`item`);--> statement-breakpoint
CREATE UNIQUE INDEX `event_participants_event_id_user_id_unique` ON `event_participants` (`event_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `friendship_user_1_user_2_unique` ON `friendship` (`user_1`,`user_2`);--> statement-breakpoint
CREATE UNIQUE INDEX `friendship_user_2_user_1_unique` ON `friendship` (`user_2`,`user_1`);--> statement-breakpoint
CREATE UNIQUE INDEX `item_bgg_id_unique` ON `item` (`bgg_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_user_id_item_id_unique` ON `reviews` (`user_id`,`item_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_auth_id_unique` ON `user` (`auth_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_stripe_customer_id_unique` ON `user` (`stripe_customer_id`);