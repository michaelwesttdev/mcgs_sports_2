import { Database } from "../sqlite";
import { TSPlayerFixtureStats,PlayerFixtureStats } from "../sqlite/t_sports/schema";
import { BaseRepository } from "./base.repository";

export class TeamSportsPlayerFixtureStatsRepository extends BaseRepository<TSPlayerFixtureStats> {
  constructor(db: Database) {
    super(db, PlayerFixtureStats);
  }
}