import { Database } from "../sqlite";
import { Fixture, TSFixture } from "../sqlite/t_sports/schema";
import { BaseRepository } from "./base.repository";

export class TeamSportsFixtureRepository extends BaseRepository<TSFixture> {
  constructor(db: Database) {
    super(db, Fixture);
  }
}
