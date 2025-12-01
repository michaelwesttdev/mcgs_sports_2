import { sqliteTable, text, index, integer } from "drizzle-orm/sqlite-core";
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
// events
const Event = sqliteTable("event", {
  id: text("id").primaryKey().notNull(),
  title: text("title", { length: 255 }).notNull(),
  description: text("description"),
  type: text("type", { enum: ["swimming","athletics", "team","tournament"] }).notNull(),
  eventType: text("event_type", { enum: ["team", "individual"] }).notNull(),
  measurementNature: text("measurement_nature", {
    enum: ["time", "length", "score", "height"],
  }),
  measurementMetric: text("measurement_metric"),
  ageGroup: text("age_group").notNull(),
  gender: text("gender", { enum: ["male", "female", "mixed"] }).notNull(),
  ...timestamps,
});
// sessions
const Session = sqliteTable("session", {
  id: text("id").primaryKey().notNull(),
  title: text("title", { length: 255 }).notNull(),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location", { length: 255 }).notNull(),
  type: text("type", { enum: ["swimming","athletics", "team","tournament"] }).notNull(),
  ...timestamps,
});

const Student = sqliteTable(
  "student",
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
  (table) => [index("student_name_idx").on(table.firstName, table.lastName)]
); 

//house
const House = sqliteTable("house", {
  id: text("id").primaryKey().notNull(),
  name: text("name", { length: 255 }).notNull(),
  abbreviation: text("abbreviation"),
  color: text("color"),
  ...timestamps,
});

export { Event, Session,Student,House };

export type MEvent = typeof Event.$inferSelect;
export type MSession = typeof Session.$inferSelect;
export type MStudent = typeof Student.$inferSelect;
export type MHouse = typeof House.$inferSelect;
