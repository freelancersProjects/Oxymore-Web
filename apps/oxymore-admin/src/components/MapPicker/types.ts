export type MapStatus = 
  | 'available'
  | 'team1_picked'
  | 'team2_picked'
  | 'team1_banned'
  | 'team2_banned'
  | 'decider';

export interface Map {
  id: string;
  name: string;
  image: string;
  status: MapStatus;
}

export type SelectedMapStatus = 'team1_picked' | 'team2_picked' | 'decider';

export interface SelectedMap extends Omit<Map, 'status'> {
  status: SelectedMapStatus;
} 
 
 