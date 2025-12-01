import { Database } from "../sqlite";
import { TournamentPlayerStat } from "../sqlite/tournaments/schema";
import { BaseRepository } from "./base.repository";

export class TournamentPlayerStatRepository extends BaseRepository<typeof TournamentPlayerStat> {
  constructor(db: Database) {
    super(db, TournamentPlayerStat);
  }
  // Additional methods specific to TournamentPlayerStatRepository
}
