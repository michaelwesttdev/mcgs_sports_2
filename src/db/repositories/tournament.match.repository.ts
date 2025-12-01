import { Database } from "../sqlite";
import { TournamentMatch } from "../sqlite/tournaments/schema";
import { BaseRepository } from "./base.repository";

export class TournamentMatchRepository extends BaseRepository<typeof TournamentMatch> {
  constructor(db: Database) {
    super(db, TournamentMatch);
  }
  // Additional methods specific to TournamentMatchRepository
}
