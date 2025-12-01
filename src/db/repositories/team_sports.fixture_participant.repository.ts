import { Database } from "../sqlite";
import { TSFixtureParticipant,FixtureParticipant } from "../sqlite/t_sports/schema";
import { BaseRepository } from "./base.repository";

export class TeamSportsFixtureParticipantRepository extends BaseRepository<TSFixtureParticipant> {
  constructor(db: Database) {
    super(db, FixtureParticipant);
  }
}

