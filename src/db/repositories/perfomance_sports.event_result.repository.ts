import { Database } from "../sqlite";
import {EventResult, PSEventResult} from "../sqlite/p_sports/schema";
import { BaseRepository } from "./base.repository";

export class PerfomanceSportsEventResultRepository extends BaseRepository<PSEventResult> {
  constructor(db: Database) {
    super(db, EventResult);
  }
}
