// src/repositories/base.repository.ts
import { SQLiteTable } from "drizzle-orm/sqlite-core";
import { eq, and, isNull } from "drizzle-orm";
import { RepositoryError } from "@/errors/repository.error";
import { Database } from "../sqlite";

export abstract class BaseRepository<T extends Record<string, any>> {
  constructor(
    protected readonly db: Database,
    protected readonly table: SQLiteTable
  ) {}

  async create(data: Omit<T, "createdAt" | "updatedAt">): Promise<T> {
    console.log("creating:", data);
    try {
      const result = await this.db.query
        .insert(this.table)
        .values(data as any)
        .returning()

        .execute();
      return result[0] as T;
    } catch (error) {
      throw new RepositoryError("Create operation failed", error);
    }
  }

  async read(id: string): Promise<T | null> {
    console.log(id);
    try {
      const result = await this.db.query
        .select()
        .from(this.table)
        .where(eq((this.table as any).id, id))
        .limit(1)
        .execute();
      return (result[0] as T) ?? null;
    } catch (error) {
      throw new RepositoryError("Read operation failed", error);
    }
  }

  async update(d: any[]): Promise<T> {
    const [id, data] = d as [
      id: string,
      data: Partial<Omit<T, "id" | "createdAt">>
    ];
    console.log("updating:", data, id);
    try {
      const result = await this.db.query
        .update(this.table)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        } as any)
        .where(eq((this.table as any).id, id))
        .returning()
        .execute();
      return result[0] as T;
    } catch (error) {
      throw new RepositoryError("Update operation failed", error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.query
        .delete(this.table)
        .where(eq((this.table as any).id, id))
        .execute();
    } catch (error) {
      throw new RepositoryError("Delete operation failed", error);
    }
  }

  async list(filters: Partial<T> = {}): Promise<T[]> {
    try {
      const whereConditions = Object.entries(filters)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) =>
          eq(this.table[key as keyof typeof this.table] as any, value)
        );

      const result = await this.db.query
        .select()
        .from(this.table)
        .where(and(...whereConditions))
        .execute();
      return result as T[];
    } catch (error) {
      console.log(error);
      throw new RepositoryError("List operation failed", error);
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const result = await this.db.query
        .select({ id: (this.table as any).id })
        .from(this.table)
        .where(
          and(
            eq((this.table as any).id, id),
            isNull((this.table as any).deletedAt)
          )
        )
        .limit(1)
        .execute();
      return result.length > 0;
    } catch (error) {
      throw new RepositoryError("Exists check failed", error);
    }
  }
}
