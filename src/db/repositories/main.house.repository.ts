import { Database } from "../sqlite";
import { Event, MHouse,House } from "../sqlite/main/schema";
import { BaseRepository } from "./base.repository";

export class MainHouseRepository extends BaseRepository<MHouse> {
  constructor(db: Database) {
    super(db, House);
  }
  // Additional methods specific to HouseRepository
}
