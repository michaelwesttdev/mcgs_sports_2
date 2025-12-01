// drizzle.config.ts
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/sqlite/t_sports/schema.ts",
  out: "./src/db/sqlite/t_sports/drizzle",
  dialect: "sqlite",
  verbose: true,
  strict: true,
} satisfies Config;
