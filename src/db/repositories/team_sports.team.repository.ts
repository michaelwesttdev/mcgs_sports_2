import { Database } from "../sqlite";
import { Team, TSTeam } from "../sqlite/t_sports/schema";
import { BaseRepository } from "./base.repository";

export class TeamSportsTeamRepository extends BaseRepository<TSTeam> {
  constructor(db: Database) {
    super(db, Team);
  }
}
