import { Database } from "../sqlite";
import { TSFixtureEvent,FixtureEvent } from "../sqlite/t_sports/schema";
import { BaseRepository } from "./base.repository";

export class TeamSportsFixtureEventRepository extends BaseRepository<TSFixtureEvent> {
  constructor(db: Database) {
    super(db, FixtureEvent);
  }
}
