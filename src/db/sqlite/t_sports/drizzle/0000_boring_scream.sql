CREATE TABLE `fixture` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`gender` text(10),
	`round` text(100),
	`date` text,
	`home_team_id` text NOT NULL,
	`away_team_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `fixture_event` (
	`id` text PRIMARY KEY NOT NULL,
	`fixture_id` text NOT NULL,
	`event_type` text NOT NULL,
	`timestamp` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `fixture_participant` (
	`id` text NOT NULL,
	`fixture_id` text NOT NULL,
	`team_id` text NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	PRIMARY KEY(`fixture_id`, `team_id`)
);
--> statement-breakpoint
CREATE INDEX `fixture_participant_fixture_idx` ON `fixture_participant` (`fixture_id`);--> statement-breakpoint
CREATE INDEX `fixture_participant_team_idx` ON `fixture_participant` (`team_id`);--> statement-breakpoint
CREATE TABLE `player` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`team_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `player_team_idx` ON `player` (`team_id`);--> statement-breakpoint
CREATE TABLE `player_fixture_stats` (
	`id` text NOT NULL,
	`player_id` text NOT NULL,
	`fixture_id` text NOT NULL,
	`stat_key` text NOT NULL,
	`stat_value` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	PRIMARY KEY(`player_id`, `fixture_id`, `stat_key`)
);
--> statement-breakpoint
CREATE INDEX `player_fixture_stats_fixture_idx` ON `player_fixture_stats` (`fixture_id`);--> statement-breakpoint
CREATE TABLE `team` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `team_name_idx` ON `team` (`name`);