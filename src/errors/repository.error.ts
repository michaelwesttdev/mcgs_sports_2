// src/errors/repository.error.ts
export class RepositoryError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = "RepositoryError";

    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
  }
}

export class NotFoundError extends RepositoryError {
  constructor(entity: string, id: string) {
    super(`${entity} with ID ${id} not found`);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends RepositoryError {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
