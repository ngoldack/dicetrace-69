CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`user_id` text NOT NULL,
	`username` text NOT NULL,
	`code` text NOT NULL,
	`verified` integer NOT NULL,
	`verified_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `verification_code_unique` ON `verification` (`code`);