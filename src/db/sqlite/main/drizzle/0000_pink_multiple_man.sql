CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`event_type` text NOT NULL,
	`measurement_nature` text,
	`measurement_metric` text,
	`age_group` text NOT NULL,
	`gender` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`date` text NOT NULL,
	`time` text,
	`location` text(255) NOT NULL,
	`type` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `student` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`age` text NOT NULL,
	`gender` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `student_name_idx` ON `student` (`first_name`,`last_name`);