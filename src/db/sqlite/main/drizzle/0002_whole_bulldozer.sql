CREATE TABLE `house` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`abbreviation` text,
	`color` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
