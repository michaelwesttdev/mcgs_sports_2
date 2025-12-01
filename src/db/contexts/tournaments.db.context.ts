import { Database } from "../sqlite";
import { TournamentTeamRepository } from "../repositories/tournament.team.repository";
import { TournamentPlayerRepository } from "../repositories/tournament.player.repository";
import { TournamentGroupRepository } from "../repositories/tournament.group.repository";
import { TournamentGroupTeamRepository } from "../repositories/tournament.group.team.repository";
import { TournamentRoundRepository } from "../repositories/tournament.round.repository";
import { TournamentMatchRepository } from "../repositories/tournament.match.repository";
import { TournamentMatchParticipantRepository } from "../repositories/tournament.match.participant.repository";
import { TournamentPlayerStatRepository } from "../repositories/tournament.player.stat.repository";

export class TournamentsDBContext {
  public team: TournamentTeamRepository;
  public player: TournamentPlayerRepository;
  public group: TournamentGroupRepository;
  public group_team: TournamentGroupTeamRepository;
  public round: TournamentRoundRepository;
  public match: TournamentMatchRepository;
  public match_participant: TournamentMatchParticipantRepository;
  public player_stat: TournamentPlayerStatRepository;

  constructor(db: Database) {
    this.team = new TournamentTeamRepository(db);
    this.player = new TournamentPlayerRepository(db);
    this.group = new TournamentGroupRepository(db);
    this.group_team = new TournamentGroupTeamRepository(db);
    this.round = new TournamentRoundRepository(db);
    this.match = new TournamentMatchRepository(db);
    this.match_participant = new TournamentMatchParticipantRepository(db);
    this.player_stat = new TournamentPlayerStatRepository(db);
  }
}
