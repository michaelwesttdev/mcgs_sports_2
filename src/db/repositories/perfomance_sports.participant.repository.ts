import { Database } from "../sqlite";
import { Participant, PSParticipant } from "../sqlite/p_sports/schema";
import { BaseRepository } from "./base.repository";

export class PerfomanceSportsParticipantRepository extends BaseRepository<PSParticipant> {
  constructor(db: Database) {
    super(db, Participant);
  }
}
