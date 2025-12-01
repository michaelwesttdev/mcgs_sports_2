CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
	`event_number` integer DEFAULT 1,
	`title` text(255) NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`measurement_nature` text,
	`measurement_metric` text,
	`age_group` text NOT NULL,
	`gender` text NOT NULL,
	`record_holder` text,
	`record` text,
	`best_score` text,
	`status` text,
	`is_record_broken` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `event_result` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text,
	`participant_id` text,
	`participant_type` text,
	`position` integer NOT NULL,
	`points` integer NOT NULL,
	`vlp` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `house` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`abbreviation` text,
	`color` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `participant` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`age` text NOT NULL,
	`gender` text NOT NULL,
	`house_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`house_id`) REFERENCES `house`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `participant_name_idx` ON `participant` (`first_name`,`last_name`);--> statement-breakpoint
CREATE INDEX `participant_house_idx` ON `participant` (`house_id`);