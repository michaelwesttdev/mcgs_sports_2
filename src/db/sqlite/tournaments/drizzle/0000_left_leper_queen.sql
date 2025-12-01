CREATE TABLE `group_team` (
	`group_id` text NOT NULL,
	`team_id` text NOT NULL,
	PRIMARY KEY(`group_id`, `team_id`),
	FOREIGN KEY (`group_id`) REFERENCES `tournament_group`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`team_id`) REFERENCES `tournament_team`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `group_team_idx` ON `group_team` (`group_id`);--> statement-breakpoint
CREATE TABLE `match_participant` (
	`match_id` text NOT NULL,
	`team_id` text,
	`position` integer NOT NULL,
	`score` integer,
	`is_winner` integer,
	PRIMARY KEY(`match_id`, `position`),
	FOREIGN KEY (`match_id`) REFERENCES `tournament_match`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`team_id`) REFERENCES `tournament_team`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `match_team_idx` ON `match_participant` (`team_id`);--> statement-breakpoint
CREATE TABLE `tournament_group` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tournament_match` (
	`id` text PRIMARY KEY NOT NULL,
	`round_id` text NOT NULL,
	`match_number` integer NOT NULL,
	`is_bye` integer DEFAULT false,
	`winner_team_id` text,
	`scheduled_at` text,
	`completed_at` text,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`round_id`) REFERENCES `tournament_round`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`winner_team_id`) REFERENCES `tournament_team`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `match_round_idx` ON `tournament_match` (`round_id`);--> statement-breakpoint
CREATE TABLE `tournament_player` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`team_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`team_id`) REFERENCES `tournament_team`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `player_team_idx` ON `tournament_player` (`team_id`);--> statement-breakpoint
CREATE TABLE `tournament_player_stat` (
	`player_id` text NOT NULL,
	`match_id` text NOT NULL,
	`stat_key` text NOT NULL,
	`stat_value` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	PRIMARY KEY(`player_id`, `match_id`, `stat_key`),
	FOREIGN KEY (`player_id`) REFERENCES `tournament_player`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`match_id`) REFERENCES `tournament_match`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `tournament_round` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`number` integer NOT NULL,
	`group_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`group_id`) REFERENCES `tournament_group`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tournament_team` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
