import { Database } from "../sqlite";
import { Event, MEvent } from "../sqlite/main/schema";
import { BaseRepository } from "./base.repository";

export class MainEventRepository extends BaseRepository<MEvent> {
  constructor(db: Database) {
    super(db, Event);
  }
  // Additional methods specific to EventRepository
}
