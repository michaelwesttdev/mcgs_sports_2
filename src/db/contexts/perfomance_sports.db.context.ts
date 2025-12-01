import { PerfomanceSportsEventRepository } from "../repositories/perfomance_sports.event.repository";
import { PerfomanceSportsHouseRepository } from "../repositories/perfomance_sports.house.repository";
import { PerfomanceSportsParticipantRepository } from "../repositories/perfomance_sports.participant.repository";
import { Database } from "../sqlite";
import {PerfomanceSportsEventResultRepository} from "@/db/repositories/perfomance_sports.event_result.repository";

export class PerformanceSportsDBContext {
  public event: PerfomanceSportsEventRepository;
  public participant: PerfomanceSportsParticipantRepository;
  public house: PerfomanceSportsHouseRepository;
  public event_result: PerfomanceSportsEventResultRepository;
  constructor(db: Database) {
    this.event = new PerfomanceSportsEventRepository(db);
    this.participant = new PerfomanceSportsParticipantRepository(db);
    this.house = new PerfomanceSportsHouseRepository(db);
    this.event_result = new PerfomanceSportsEventResultRepository(db);
  }
}
