import { Database } from "../sqlite";
import { TournamentPlayer } from "../sqlite/tournaments/schema";
import { BaseRepository } from "./base.repository";

export class TournamentPlayerRepository extends BaseRepository<typeof TournamentPlayer> {
  constructor(db: Database) {
    super(db, TournamentPlayer);
  }
  // Additional methods specific to TournamentPlayerRepository
}
