export interface Team {
  id: string;
  name: string;
  logo?: string;
  description: string;
  members: number;
  maxMembers: number;
  captain: string;
  isPremium: boolean;
  isVerified: boolean;
  rating: number;
  gamesPlayed: number;
  winRate: number;
  region: string;
  foundedDate: string;
  tags: string[];
  isRecruiting: boolean;
  requirements: string[];
}
