// drizzle.config.ts
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/sqlite/tournaments/schema.ts",
  out: "./src/db/sqlite/tournaments/drizzle",
  dialect: "sqlite",
  verbose: true,
  strict: true,
} satisfies Config;
