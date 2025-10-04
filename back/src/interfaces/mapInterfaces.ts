export interface Map {
  id_map: string;
  map_name: string;
  image_url?: string;
}

export interface MapInput {
  map_name: string;
  image_url?: string;
}

export interface MapUpdate {
  map_name?: string;
  image_url?: string;
}

export interface MapStats {
  total_maps: number;
  maps_with_images: number;
  most_played_map: string;
  average_play_rate: number;
}
