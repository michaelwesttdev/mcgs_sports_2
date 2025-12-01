import { Database } from "../sqlite";
import { TournamentRound } from "../sqlite/tournaments/schema";
import { BaseRepository } from "./base.repository";

export class TournamentRoundRepository extends BaseRepository<typeof TournamentRound> {
  constructor(db: Database) {
    super(db, TournamentRound);
  }
  // Additional methods specific to TournamentRoundRepository
}
