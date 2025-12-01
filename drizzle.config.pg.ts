// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/sqlite/schema.ts",
  out: "./src/db/sqlite/drizzle",
  driver: "pglite",
  dbCredentials: {
    url: "",
  },
  dialect: "postgresql",
  verbose: true,
  strict: true,
} satisfies Config;
