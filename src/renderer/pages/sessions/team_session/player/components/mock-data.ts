import { TSPlayer, TSTeam, TSFixture, TSPlayerFixtureStats } from "@/db/sqlite/t_sports/schema";

export const mockTeams: TSTeam[] = [
  { id: 'team-1', name: 'Warriors', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
  { id: 'team-2', name: 'Titans', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
];

export const mockPlayers: TSPlayer[] = [
  { id: 'player-1', name: 'John Doe', teamId: 'team-1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
  { id: 'player-2', name: 'Jane Smith', teamId: 'team-2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
  { id: 'player-3', name: 'Peter Jones', teamId: 'team-1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
];

export const mockFixtures: TSFixture[] = [
  {
    id: 'fixture-1',
    name: 'Semi-Final 1',
    gender: 'boys',
    round: 'semi-final',
    date: new Date().toISOString(),
    homeTeamId: 'team-1',
    awayTeamId: 'team-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null
  },
];

export const mockPlayerStats: TSPlayerFixtureStats[] = [
  {
    id: 'stat-1',
    playerId: 'player-1',
    fixtureId: 'fixture-1',
    statKey: 'goals',
    statValue: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null
  },
  {
    id: 'stat-2',
    playerId: 'player-1',
    fixtureId: 'fixture-1',
    statKey: 'assists',
    statValue: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null
  },
  {
    id: 'stat-3',
    playerId: 'player-2',
    fixtureId: 'fixture-1',
    statKey: 'goals',
    statValue: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null
  },
];
