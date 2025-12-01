export type PlacePoints = {
  [place: number]: number; // e.g. 1 => 10, 2 => 8, etc.
};
export type StatKeys = string[];
export type tEventType = string[];

export type PointsSettings = {
  team?: PlacePoints;
  individual?: PlacePoints;
  vlp?: PlacePoints;
};

export type TournamentFormat =
  | {
      name: "Single Elimination";
      description: string;
    }
  | {
      name: "Double Elimination";
      description: string;
    }
  | {
      name: "Round Robin";
      description: string;
      variants: string[];
    }
  | {
      name: "Swiss System";
      description: string;
    }
  | {
      name: "League";
      description: string;
    }
  | {
      name: "Group + Knockout Hybrid";
      description: string;
    }
  | {
      name: "Ladder Tournament";
      description: string;
    }
  | {
      name: "Gauntlet Format";
      description: string;
    }
  | {
      name: "Pyramid or Escalation Format";
      description: string;
    }
  | {
      name: "Multistage Tournament";
      description: string;
    }
  | {
      name: "King of the Hill";
      description: string;
    }
  | {
      name: "Elimination with Consolation";
      description: string;
    }
  | {
      name: "Team Relay / Cumulative Scoring";
      description: string;
    }
  | {
      name: "Knockout + Repechage";
      description: string;
    };

export type TieBreakerOption= {
    value: string;
    label: string;
}

export type Settings = Record<string, never>;

export type PSessionSettings = {
  rules: {
    maxEventsPerPerson: number;
  };
  ageGroups: Record<string, number | [number, number]>;
  points: PointsSettings;
};

export type TSessionSettings = {
  statKeys: StatKeys;
  eventTypes: tEventType;
};

export type TournamentSessionSettings = {
  format: TournamentFormat;
  gender: "male"|"female"|"mixed";
  ageGroup?:string,
  tieBreakerOptions:TieBreakerOption[],
  allowDraws:boolean,
  useGroups:boolean
};

export type SessionSettings = PSessionSettings|TSessionSettings|TournamentSessionSettings

export const defaultPSessionSettings: PSessionSettings = {
  rules: {
    maxEventsPerPerson: 10,
  },
  ageGroups: {
    U14: [12, 13],
    U16: [14, 15],
    U18: [16, 17],
    open: 18,
  },
  points: {
    individual: {
      1: 10,
      2: 8,
      3: 6,
      4: 4,
      5: 2,
      6: 1,
    },
    team: {
      1: 12,
      2: 8,
      3: 6,
    },
    vlp: {
      1: 10,
    },
  },
};

export const defaultTSessionSettings: TSessionSettings = {
  statKeys: [],
  eventTypes: [],
};

export const defaultSettings: Settings = {};

export const metrics = {
  time: {
    minutes: {
      abbr: "min",
      regex: "^([0-5]?d):(d{2})(?:.(d{1,2}))?$", // mm:ss(.SS)
    },
    seconds: {
      abbr: "s",
      regex: "^d{1,2}(?:.d{1,2})?$", // ss(.SS)
    },
    hours: {
      abbr: "h",
      regex: "^(d{1,2}):(d{2}):(d{2})(?:.(d{1,2}))?$", // HH:mm:ss(.SS)
    },
    days: {
      abbr: "d",
      regex: "^d+$", // integer days
    },
    milliseconds: {
      abbr: "ms",
      regex: "^d{1,3}$", // ms
    },
  },
  height: {
    meters: {
      abbr: "m",
      regex: "^d+(.d+)?$",
    },
    centimeters: {
      abbr: "cm",
      regex: "^d+(.d+)?$",
    },
    millimeters: {
      abbr: "mm",
      regex: "^d+(.d+)?$",
    },
    feet: {
      abbr: "ft",
      regex: "^d+(.d+)?$",
    },
    inches: {
      abbr: "in",
      regex: "^d+(.d+)?$",
    },
    miles: {
      abbr: "mi",
      regex: "^d+(.d+)?$",
    },
    kilometers: {
      abbr: "km",
      regex: "^d+(.d+)?$",
    },
  },
  length: {
    meters: {
      abbr: "m",
      regex: "^d+(.d+)?$",
    },
    centimeters: {
      abbr: "cm",
      regex: "^d+(.d+)?$",
    },
    millimeters: {
      abbr: "mm",
      regex: "^d+(.d+)?$",
    },
    feet: {
      abbr: "ft",
      regex: "^d+(.d+)?$",
    },
    inches: {
      abbr: "in",
      regex: "^d+(.d+)?$",
    },
    yards: {
      abbr: "yd",
      regex: "^d+(.d+)?$",
    },
    miles: {
      abbr: "mi",
      regex: "^d+(.d+)?$",
    },
    kilometers: {
      abbr: "km",
      regex: "^d+(.d+)?$",
    },
    nauticalMiles: {
      abbr: "nmi",
      regex: "^d+(.d+)?$",
    },
  },
  score: {
    points: {
      abbr: "pts",
      regex: "^d+(.d+)?$",
    },
    percentage: {
      abbr: "%",
      regex: "^(100(.0+)?|d{1,2}(.d+)?)$", // 0-100%
    },
  },
};

export const formats: TournamentFormat[] = [
  {
    name: "Single Elimination",
    description:
      "Teams are eliminated after one loss. The winner advances to the next round until a champion is crowned.",
  },
  {
    name: "Double Elimination",
    description:
      "Players/teams must lose twice to be eliminated. One bracket for winners, one for losers. Final is usually between bracket winners.",
  },
  {
    name: "Round Robin",
    description:
      "Each team plays every other team. Rankings are based on overall performance.",
    variants: ["Single Round Robin", "Double Round Robin"],
  },
  {
    name: "Swiss System",
    description:
      "Players play a set number of rounds against others with similar records. No one is eliminated.",
  },
  {
    name: "League",
    description:
      "Long-term round-robin format with points awarded for wins/draws. Winner is the one with most points after all rounds.",
  },
  {
    name: "Group + Knockout Hybrid",
    description:
      "Begins with group stages (round robin), top teams advance to single or double elimination knockouts.",
  },
  {
    name: "Ladder Tournament",
    description:
      "Participants challenge those above them in a ranking ladder. Winners climb, losers fall.",
  },
  {
    name: "Gauntlet Format",
    description:
      "Lowest-ranked teams face off first. Winner challenges the next higher seed, continuing until the top seed is challenged.",
  },
  {
    name: "Pyramid or Escalation Format",
    description:
      "Players progress up a pyramid-shaped hierarchy. Fewer participants as you go higher. Often used in promotion systems.",
  },
  {
    name: "Multistage Tournament",
    description:
      "Combines multiple formats in phases, such as Swiss + Round Robin + Knockouts. Used in large or professional competitions.",
  },
  {
    name: "King of the Hill",
    description:
      "One player/team defends the 'king' position. Challengers play one after another. Winner stays king.",
  },
  {
    name: "Elimination with Consolation",
    description:
      "Losing participants drop into a separate bracket to determine final placements beyond just 1st place.",
  },
  {
    name: "Team Relay / Cumulative Scoring",
    description:
      "Teams accumulate points over multiple events. The team with the highest total score wins.",
  },
  {
    name: "Knockout + Repechage",
    description:
      "Players who lose to the finalists get a second chance to compete for bronze via the repechage bracket.",
  },
];
export const tieBreakerOptions:TieBreakerOption[] = [
    { value: "head_to_head", label: "Head-to-Head" },
    { value: "goal_difference", label: "Goal Difference" },
    { value: "goals_scored", label: "Goals Scored" },
    { value: "goals_conceded", label: "Goals Conceded" },
    { value: "disciplinary", label: "Disciplinary Record" },
  ]

export const genders = [
  "male",
  "female",
  "mixed",
]
export const defaultTournamentSessionSettings: TournamentSessionSettings = {
  format: formats[0],
  gender:"mixed",
  tieBreakerOptions:[tieBreakerOptions[0]],
  allowDraws:false,
  useGroups:false
}