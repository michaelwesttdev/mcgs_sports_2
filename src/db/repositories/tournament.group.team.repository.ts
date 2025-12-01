import { Database } from "../sqlite";
import { GroupTeam } from "../sqlite/tournaments/schema";
import { BaseRepository } from "./base.repository";

export class TournamentGroupTeamRepository extends BaseRepository<typeof GroupTeam> {
  constructor(db: Database) {
    super(db, GroupTeam);
  }
  // Additional methods specific to TournamentGroupTeamRepository
}
