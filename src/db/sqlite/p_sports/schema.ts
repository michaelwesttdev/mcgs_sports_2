import {
  sqliteTable,
  text,
  integer,
  index,
  SQLiteBoolean,
} from "drizzle-orm/sqlite-core";
import { sql, InferColumnsDataTypes } from "drizzle-orm";
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

//house
const House = sqliteTable("house", {
  id: text("id").primaryKey().notNull(),
  name: text("name", { length: 255 }).notNull(),
  abbreviation: text("abbreviation"),
  color: text("color"),
  ...timestamps,
});

//participant
const Participant = sqliteTable(
  "participant",
  {
    id: text("id").primaryKey().notNull(),
    firstName: text("first_name", { length: 255 }).notNull(),
    lastName: text("last_name", { length: 255 }).notNull(),
    dob: text("age").notNull(),
    gender: text("gender", { enum: ["male", "female"] }).notNull(),
    houseId: text("house_id").references(() => House.id, {
      onDelete: "cascade",
    }),
    ...timestamps,
  },
  (table) => [
    index("participant_name_idx").on(table.firstName, table.lastName),
    index("participant_house_idx").on(table.houseId),
  ]
);
// events
const Event = sqliteTable("event", {
  id: text("id").primaryKey().notNull(),
  eventNumber: integer("event_number").default(1),
  title: text("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: text("type", { enum: ["team", "individual"] }).notNull(),
  measurementNature: text("measurement_nature",{enum:["time", "height","length", "score"]}),
  measurementMetric: text("measurement_metric"),
  ageGroup: text("age_group").notNull(),
  gender: text("gender", { enum: ["male", "female", "mixed"] }).notNull(),
  recordHolder: text("record_holder"),
  record: text("record"),
  bestScore: text("best_score"),
  status: text("status", { enum: ["pending", "complete"] }),
  isRecordBroken: integer("is_record_broken", { mode: "boolean" }),
  ...timestamps,
});
const EventResult = sqliteTable("event_result", {
  id: text("id").primaryKey().notNull(),
  eventId: text("event_id").references(() => Event.id, { onDelete: "cascade" }),
  participantId: text("participant_id"),
  participantType: text("participant_type", { enum: ["house", "participant"] }),
  position: integer("position").notNull(),
  points: integer("points").notNull(),
  vlp: integer("vlp").notNull(),
  ...timestamps,
});

export { Participant, Event, House,EventResult };

export type PSParticipant = typeof Participant.$inferSelect;
export type PSEvent = typeof Event.$inferSelect;
export type PSHouse = typeof House.$inferSelect;
export type PSEventResult = typeof EventResult.$inferSelect;
