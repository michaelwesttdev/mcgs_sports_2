import { Database } from "../sqlite";
import { MSession, Session } from "../sqlite/main/schema";
import { BaseRepository } from "./base.repository";

export class SessionRepository extends BaseRepository<MSession> {
  constructor(db: Database) {
    super(db, Session);
  }
  // Additional methods specific to SessionRepository
}
