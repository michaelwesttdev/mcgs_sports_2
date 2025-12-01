
import {
  sqliteTable,
  text,
  integer,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Helper for timestamps
const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text("deleted_at"),
};

// Team
const Team = sqliteTable(
  "team",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name", { length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => [index("team_name_idx").on(table.name)]
);

// Player
const Player = sqliteTable(
  "player",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name", { length: 255 }).notNull(),
    teamId: text("team_id").notNull(), // FK to Team
    ...timestamps,
  },
  (table) => [index("player_team_idx").on(table.teamId)]
);

// Fixture
const Fixture = sqliteTable("fixture", {
  id: text("id").primaryKey().notNull(),
  name: text("name", { length: 255 }).notNull(),
  gender: text("gender", { length: 10 }), // "boys", "girls", "mixed"
  round: text("round", { length: 100 }), // e.g., "semi-final"
  date: text("date"), // ISO format 
  homeTeamId: text("home_team_id").notNull(),
  awayTeamId: text("away_team_id").notNull(),
  ...timestamps,
}); 

// Fixture Event
const FixtureEvent = sqliteTable("fixture_event", {
  id: text("id").primaryKey().notNull(),
  fixtureId: text("fixture_id").notNull(),
  eventType: text("event_type").notNull(), // e.g., "goal", "try", "wicket"
  timestamp: text("timestamp").notNull(),
  ...timestamps,
});

// Fixture Participant
const FixtureParticipant = sqliteTable(
  "fixture_participant",
  { 
    id:text("id").notNull(),
    fixtureId: text("fixture_id").notNull(),
    teamId: text("team_id").notNull(),
    score: integer("score").notNull().default(0),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.fixtureId, table.teamId] }),
    index("fixture_participant_fixture_idx").on(table.fixtureId),
    index("fixture_participant_team_idx").on(table.teamId),
  ]
);

// Player Fixture Stats
const PlayerFixtureStats = sqliteTable(
  "player_fixture_stats",
  {
    id:text("id").notNull(),
    playerId: text("player_id").notNull(),
    fixtureId: text("fixture_id").notNull(),
    statKey: text("stat_key").notNull(), // e.g., "goals", "runs", "points"
    statValue: text("stat_value").notNull(),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.playerId, table.fixtureId, table.statKey] }),
    index("player_fixture_stats_fixture_idx").on(table.fixtureId),
  ]
);

export { Team, Player, Fixture, FixtureEvent, FixtureParticipant, PlayerFixtureStats };

export type TSTeam = typeof Team.$inferSelect;
export type TSPlayer = typeof Player.$inferSelect;
export type TSFixture = typeof Fixture.$inferSelect;
export type TSFixtureEvent = typeof FixtureEvent.$inferSelect;
export type TSFixtureParticipant = typeof FixtureParticipant.$inferSelect;
export type TSPlayerFixtureStats = typeof PlayerFixtureStats.$inferSelect;
