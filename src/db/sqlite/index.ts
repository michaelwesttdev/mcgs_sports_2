// src/db/database.ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import SQLiteDatabase from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { DatabaseConfig, SQL, Transaction } from "@/shared/types/db";
import { getMainDbUrl } from "@/shared/helpers/urls";

export class Database {
  private sqlite: ReturnType<typeof this.initializeDatabase>;
  private drizzle: ReturnType<typeof drizzle>;

  constructor(private config: DatabaseConfig) {
    this.sqlite = this.initializeDatabase();
    this.drizzle = drizzle({ schema: this.config.schema, client: this.sqlite });
  }

  private initializeDatabase() {
    try {
      // Ensure app data directory exists
      const dbPath = this.config.dbPath ?? getMainDbUrl();
      const sqliteInstance = new SQLiteDatabase(dbPath, {
        verbose: this.config.debug ? console.log : undefined,
      });

      // Enable WAL mode for better concurrency
      sqliteInstance.pragma("journal_mode = WAL");

      // Enable foreign key constraints
      sqliteInstance.pragma("foreign_keys = ON");

      // Apply migrations
      if (this.config.migrate) {
        this.runMigrations();
      }

      console.log("Database initialized at:", dbPath);
      return sqliteInstance;
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw error;
    }
  }

  private runMigrations(folder = "main") {
    try {
      const migrationsFolder =
        this.config.migrationsPath || `${__dirname}/${folder}/drizzle`;

      const sqlite = new SQLiteDatabase(this.config.dbPath ?? getMainDbUrl());
      const db = drizzle(sqlite, { schema: this.config.schema });

      console.info("⌛Running migrations...");
      const start = Date.now();

      migrate(db, {
        migrationsFolder: migrationsFolder,
      });

      const end = Date.now();
      console.info(`✅Migrations completed. Took ${end - start}ms`);
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  }

  // Transaction support
  async transaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T> {
    const tx = this.sqlite.transaction(() => {
      return callback({
        execute: (query: SQL) =>
          this.sqlite.prepare(query.sql).run(query.params),
        query: (query: SQL) => this.sqlite.prepare(query.sql).all(query.params),
      });
    });

    return tx();
  }

  // Direct access to Drizzle methods
  get query() {
    return this.drizzle;
  }

  // Close the database connection
  close() {
    if (this.sqlite) {
      this.sqlite.close();
      console.log("Database connection closed");
    }
  }
}

export function initDb(config: DatabaseConfig) {
  const db = new Database(config);
  return db;
}
