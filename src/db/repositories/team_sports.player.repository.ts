import { Database } from "../sqlite";
import { Player, TSPlayer } from "../sqlite/t_sports/schema";
import { BaseRepository } from "./base.repository";

export class TeamSportsPlayerRepository extends BaseRepository<TSPlayer> {
  constructor(db: Database) {
    super(db, Player);
  }
}
