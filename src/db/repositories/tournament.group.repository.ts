import { Database } from "../sqlite";
import { TournamentGroup } from "../sqlite/tournaments/schema";
import { BaseRepository } from "./base.repository";

export class TournamentGroupRepository extends BaseRepository<typeof TournamentGroup> {
  constructor(db: Database) {
    super(db, TournamentGroup);
  }
  // Additional methods specific to TournamentGroupRepository
}
