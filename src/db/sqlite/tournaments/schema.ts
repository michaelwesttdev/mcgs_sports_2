import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  deletedAt: text("deleted_at"),
};

// ─── Teams and Players ────────────────────────

export const TournamentTeam = sqliteTable("tournament_team", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  ...timestamps,
});

export const TournamentPlayer = sqliteTable("tournament_player", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  teamId: text("team_id").references(()=>TournamentTeam.id,{
    onDelete:"cascade"
  }),
  ...timestamps,
}, (t) => [index("player_team_idx").on(t.teamId)]);

// ─── Grouping Support ─────────────────────────

export const TournamentGroup = sqliteTable("tournament_group", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(), // Group A, B, etc.
});

export const GroupTeam = sqliteTable("group_team", {
  groupId: text("group_id").notNull().references(() => TournamentGroup.id, {
    onDelete: "cascade"}),
  teamId: text("team_id").notNull().references(() => TournamentTeam.id, {
    onDelete: "cascade"})
}, (t) => [
  primaryKey({ columns: [t.groupId, t.teamId] }),
  index("group_team_idx").on(t.groupId),
]);

// ─── Rounds & Matches ─────────────────────────

export const TournamentRound = sqliteTable("tournament_round", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(), // "Round 1", "Semis"
  number: integer("number").notNull(),
  groupId: text("group_id").references(() => TournamentGroup.id, {
    onDelete: "cascade"}), // optional
  ...timestamps,
});


export const TournamentMatch = sqliteTable("tournament_match", {
  id: text("id").primaryKey().notNull(),
  roundId: text("round_id").notNull().references(() => TournamentRound.id, {
    onDelete: "cascade"}),
  matchNumber: integer("match_number").notNull(),
  isBye: integer("is_bye", { mode: "boolean" }).default(false),
  winnerTeamId: text("winner_team_id").references(() => TournamentTeam.id, {
    onDelete: "set null"}),
  scheduledAt: text("scheduled_at"),
  completedAt: text("completed_at"),
  notes: text("notes"),
  ...timestamps,
}, (t) => [index("match_round_idx").on(t.roundId)]);

// ─── Match Participants ───────────────────────

export const MatchParticipant = sqliteTable("match_participant", {
  matchId: text("match_id").notNull().references(() => TournamentMatch.id, {
    onDelete: "set null"}),
  teamId: text("team_id").references(() => TournamentTeam.id, {
    onDelete: "set null"}),
  position: integer("position").notNull(), // 1 or 2 (or N for FFA)
  score: integer("score"),
  isWinner: integer("is_winner", { mode: "boolean" }),
}, (t) => [
  primaryKey({ columns: [t.matchId, t.position] }),
  index("match_team_idx").on(t.teamId),
]);

// ─── Optional Player Stats ────────────────────

export const TournamentPlayerStat = sqliteTable("tournament_player_stat", {
  playerId: text("player_id").notNull().references(() => TournamentPlayer.id, {
    onDelete: "set null"}),
  matchId: text("match_id").notNull().references(() => TournamentMatch.id, {
    onDelete: "set null"}),
  statKey: text("stat_key").notNull(),
  statValue: text("stat_value").notNull(),
  ...timestamps,
}, (t) => [
  primaryKey({ columns: [t.playerId, t.matchId, t.statKey] }),
]);

export type TournamentTeam = typeof TournamentTeam.$inferSelect;
export type TournamentPlayer = typeof TournamentPlayer.$inferSelect;
export type TournamentGroup = typeof TournamentGroup.$inferSelect;
export type TournamentRound = typeof TournamentRound.$inferSelect;
export type TournamentMatch = typeof TournamentMatch.$inferSelect;
export type MatchParticipant = typeof MatchParticipant.$inferSelect;
export type TournamentPlayerStat = typeof TournamentPlayerStat.$inferSelect;
export type GroupTeam = typeof GroupTeam.$inferSelect;