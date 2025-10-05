export interface TeamMatch {
  opponent: string;
  result: 'W' | 'L' | 'D';
  score: string;
}

export interface TeamStats {
  id: number;
  rank: number;
  teamName: string;
  teamLogo: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  winstreak: number;
  lastFiveMatches: TeamMatch[];
  gamesPlayed: number;
  winRate: number;
}

export interface LeagueSeason {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
}

export interface LeagueDivision {
  id: string;
  name: string;
  level: number;
  maxTeams: number;
}
