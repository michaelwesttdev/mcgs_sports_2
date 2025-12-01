import { Database } from "../sqlite";
import { House, PSHouse } from "../sqlite/p_sports/schema";
import { BaseRepository } from "./base.repository";

export class PerfomanceSportsHouseRepository extends BaseRepository<PSHouse> {
  constructor(db: Database) {
    super(db, House);
  }
}
