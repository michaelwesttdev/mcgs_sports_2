import { TeamSportsFixtureRepository } from "../repositories/team_sports.fixture.repository";
import { TeamSportsFixtureEventRepository } from "../repositories/team_sports.fixture_event.repository";
import { TeamSportsFixtureParticipantRepository } from "../repositories/team_sports.fixture_participant.repository";
import { TeamSportsPlayerRepository } from "../repositories/team_sports.player.repository";
import { TeamSportsPlayerFixtureStatsRepository } from "../repositories/team_sports.player_fixture_stats.repository";
import { TeamSportsTeamRepository } from "../repositories/team_sports.team.repository";
import { Database } from "../sqlite";

export class TeamSportsDBContext {
  public team:TeamSportsTeamRepository;
  public player:TeamSportsPlayerRepository;
  public fixture:TeamSportsFixtureRepository;
  public fixture_event:TeamSportsFixtureEventRepository;
  public fixture_participant:TeamSportsFixtureParticipantRepository;
  public player_fixture_stats:TeamSportsPlayerFixtureStatsRepository;
  constructor(db: Database) {
    this.team = new TeamSportsTeamRepository(db);
    this.player = new TeamSportsPlayerRepository(db);
    this.fixture = new TeamSportsFixtureRepository(db);
    this.fixture_event = new TeamSportsFixtureEventRepository(db);
    this.fixture_participant = new TeamSportsFixtureParticipantRepository(db);
    this.player_fixture_stats = new TeamSportsPlayerFixtureStatsRepository(db);
  }
}
