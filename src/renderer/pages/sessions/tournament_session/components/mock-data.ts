export interface Player {
  id: string
  name: string
  stats: {
    goals: number
    assists: number
    yellowCards?: number
  }
}

export interface Team {
  id: string
  name: string
  players: Player[]
}

export interface Match {
  id: string
  matchNumber: number
  round: string
  group?: string
  team1Id: string
  team2Id: string
  score1: number | null
  score2: number | null
  winnerId?: string
  isBye?: boolean
}

export interface Group {
  name: string
  teams: string[]
}

export interface Tournament {
  id: string
  name: string
  format: string
  ageGroup: string
  gender: string
  teams: Team[]
  matches: Match[]
  groups: Group[]
}

// Mock data
export const mockTournament: Tournament = {
  id: "tournament-1",
  name: "Spring Championship 2024",
  format: "Double Elimination",
  ageGroup: "U-16",
  gender: "Mixed",
  teams: [
    {
      id: "team-1",
      name: "Thunder Bolts",
      players: [
        { id: "p1", name: "Alex Johnson", stats: { goals: 5, assists: 3 } },
        { id: "p2", name: "Sam Wilson", stats: { goals: 2, assists: 4 } },
        { id: "p3", name: "Jordan Lee", stats: { goals: 1, assists: 2 } },
      ],
    },
    {
      id: "team-2",
      name: "Lightning Strikes",
      players: [
        { id: "p4", name: "Casey Brown", stats: { goals: 4, assists: 2 } },
        { id: "p5", name: "Riley Davis", stats: { goals: 3, assists: 5 } },
        { id: "p6", name: "Morgan Taylor", stats: { goals: 2, assists: 1 } },
      ],
    },
    {
      id: "team-3",
      name: "Fire Dragons",
      players: [
        { id: "p7", name: "Avery Martinez", stats: { goals: 6, assists: 1 } },
        { id: "p8", name: "Blake Anderson", stats: { goals: 1, assists: 3 } },
        { id: "p9", name: "Cameron White", stats: { goals: 3, assists: 2 } },
      ],
    },
    {
      id: "team-4",
      name: "Ice Wolves",
      players: [
        { id: "p10", name: "Dakota Garcia", stats: { goals: 2, assists: 4 } },
        { id: "p11", name: "Emery Rodriguez", stats: { goals: 4, assists: 1 } },
        { id: "p12", name: "Finley Lopez", stats: { goals: 1, assists: 2 } },
      ],
    },
    {
      id: "team-5",
      name: "Storm Eagles",
      players: [
        { id: "p13", name: "Harper Wilson", stats: { goals: 3, assists: 3 } },
        { id: "p14", name: "Indigo Moore", stats: { goals: 2, assists: 2 } },
        { id: "p15", name: "Jaden Clark", stats: { goals: 4, assists: 1 } },
      ],
    },
    {
      id: "team-6",
      name: "Wind Runners",
      players: [
        { id: "p16", name: "Kai Lewis", stats: { goals: 1, assists: 5 } },
        { id: "p17", name: "Lane Walker", stats: { goals: 3, assists: 2 } },
        { id: "p18", name: "Max Hall", stats: { goals: 2, assists: 3 } },
      ],
    },
    {
      id: "team-7",
      name: "Solar Flares",
      players: [
        { id: "p19", name: "Nova Allen", stats: { goals: 5, assists: 1 } },
        { id: "p20", name: "Ocean Young", stats: { goals: 1, assists: 4 } },
        { id: "p21", name: "Phoenix King", stats: { goals: 2, assists: 2 } },
      ],
    },
    {
      id: "team-8",
      name: "Cosmic Stars",
      players: [
        { id: "p22", name: "Quinn Wright", stats: { goals: 3, assists: 3 } },
        { id: "p23", name: "River Scott", stats: { goals: 4, assists: 2 } },
        { id: "p24", name: "Sage Green", stats: { goals: 1, assists: 1 } },
      ],
    },
  ],
  groups: [
    {
      name: "A",
      teams: ["team-1", "team-2", "team-3", "team-4"],
    },
    {
      name: "B",
      teams: ["team-5", "team-6", "team-7", "team-8"],
    },
  ],
  matches: [
    // Group A matches
    {
      id: "match-1",
      matchNumber: 1,
      round: "Group Stage",
      group: "A",
      team1Id: "team-1", 
      team2Id: "team-2",
      score1: 2,
      score2: 1,
      winnerId: "team-1",
    },
    {
      id: "match-2",
      matchNumber: 2,
      round: "Group Stage",
      group: "A",
      team1Id: "team-3",
      team2Id: "team-4",
      score1: 1,
      score2: 1,
    },
    {
      id: "match-3",
      matchNumber: 3,
      round: "Group Stage",
      group: "A",
      team1Id: "team-1",
      team2Id: "team-3",
      score1: 3,
      score2: 0,
      winnerId: "team-1",
    },
    {
      id: "match-4",
      matchNumber: 4,
      round: "Group Stage",
      group: "A",
      team1Id: "team-2",
      team2Id: "team-4",
      score1: 2,
      score2: 2,
    },
    // Group B matches
    {
      id: "match-5",
      matchNumber: 5,
      round: "Group Stage",
      group: "B",
      team1Id: "team-5",
      team2Id: "team-6",
      score1: 1,
      score2: 2,
      winnerId: "team-6",
    },
    {
      id: "match-6",
      matchNumber: 6,
      round: "Group Stage",
      group: "B",
      team1Id: "team-7",
      team2Id: "team-8",
      score1: 3,
      score2: 1,
      winnerId: "team-7",
    },
    {
      id: "match-7",
      matchNumber: 7,
      round: "Group Stage",
      group: "B",
      team1Id: "team-5",
      team2Id: "team-7",
      score1: 0,
      score2: 1,
      winnerId: "team-7",
    },
    // Knockout matches
    {
      id: "match-8",
      matchNumber: 8,
      round: "Quarterfinals",
      team1Id: "team-1",
      team2Id: "team-6",
      score1: 2,
      score2: 0,
      winnerId: "team-1",
    },
    {
      id: "match-9",
      matchNumber: 9,
      round: "Quarterfinals",
      team1Id: "team-7",
      team2Id: "team-2",
      score1: 1,
      score2: 3,
      winnerId: "team-2",
    },
    {
      id: "match-10",
      matchNumber: 10,
      round: "Semifinals",
      team1Id: "team-1",
      team2Id: "team-2",
      score1: null,
      score2: null,
    },
    {
      id: "match-11",
      matchNumber: 11,
      round: "Final",
      team1Id: "team-1", // Assuming team-1 wins semifinal
      team2Id: "team-2", // TBD from other semifinal
      score1: null,
      score2: null,
    },
  ],
}
