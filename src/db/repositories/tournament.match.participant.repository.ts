import { Database } from "../sqlite";
import { MatchParticipant } from "../sqlite/tournaments/schema";
import { BaseRepository } from "./base.repository";

export class TournamentMatchParticipantRepository extends BaseRepository<typeof MatchParticipant> {
  constructor(db: Database) {
    super(db, MatchParticipant);
  }
  // Additional methods specific to MatchParticipantRepository
}
