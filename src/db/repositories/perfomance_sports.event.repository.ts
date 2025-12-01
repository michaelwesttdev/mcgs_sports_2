import { Database } from "../sqlite";
import { Event, PSEvent } from "../sqlite/p_sports/schema";
import { BaseRepository } from "./base.repository";

export class PerfomanceSportsEventRepository extends BaseRepository<PSEvent> {
  constructor(db: Database) {
    super(db, Event);
  }
}
