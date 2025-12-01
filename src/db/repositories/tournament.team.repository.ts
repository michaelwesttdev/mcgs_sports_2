import { Database } from "../sqlite";
import { TournamentTeam } from "../sqlite/tournaments/schema";
import { BaseRepository } from "./base.repository";

export class TournamentTeamRepository extends BaseRepository<typeof TournamentTeam> {
  constructor(db: Database) {
    super(db, TournamentTeam);
  }
  // Additional methods specific to TournamentTeamRepository
}
