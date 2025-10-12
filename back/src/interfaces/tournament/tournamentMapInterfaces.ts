export interface TournamentMap {
  id_tournament_map: string;
  id_tournament: string;
  id_map: string;
}

export interface TournamentMapInput {
  id_tournament: string;
  id_map: string;
}

export interface TournamentMapUpdate {
  id_tournament?: string;
  id_map?: string;
}

export interface TournamentMapStats {
  total_tournament_maps: number;
  maps_per_tournament: number;
  most_used_map_in_tournaments: string;
}
