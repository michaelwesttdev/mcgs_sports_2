// drizzle.config.ts
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/sqlite/p_sports/schema.ts",
  out: "./src/db/sqlite/p_sports/drizzle",
  dialect: "sqlite",
  verbose: true,
  strict: true,
} satisfies Config;
