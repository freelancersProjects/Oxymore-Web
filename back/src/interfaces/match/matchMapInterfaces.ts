export interface MatchMap {
  id_match_map: string;
  map_order?: number;
  id_match: string;
  id_map: string;
  picked_by?: string;
  winner_team?: string;
}

export interface MatchMapInput {
  map_order?: number;
  id_match: string;
  id_map: string;
  picked_by?: string;
  winner_team?: string;
}

export interface MatchMapUpdate {
  map_order?: number;
  id_match?: string;
  id_map?: string;
  picked_by?: string;
  winner_team?: string;
}

export interface MatchMapStats {
  total_match_maps: number;
  maps_played_today: number;
  average_maps_per_match: number;
  most_picked_map: string;
}
