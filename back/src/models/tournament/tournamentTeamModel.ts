/**
 * @openapi
 * components:
 *   schemas:
 *     TournamentTeamInput:
 *       type: object
 *       required:
 *         - tournament_id
 *         - team_id
 *       properties:
 *         tournament_id:
 *           type: string
 *         team_id:
 *           type: string
 *         status:
 *           type: string
 *           enum: [registered, confirmed, disqualified, withdrawn]
 *         seed_position:
 *           type: integer
 *         final_position:
 *           type: integer
 *         matches_played:
 *           type: integer
 *         matches_won:
 *           type: integer
 *         matches_lost:
 *           type: integer
 *         matches_drawn:
 *           type: integer
 *         points_earned:
 *           type: integer
 */

export interface TournamentTeam {
  id: string;
  tournament_id: string;
  team_id: string;
  registration_date: string;
  status: 'registered' | 'confirmed' | 'disqualified' | 'withdrawn';
  seed_position?: number;
  final_position?: number;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
  matches_drawn: number;
  points_earned: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTournamentTeamData {
  tournament_id: string;
  team_id: string;
  status?: 'registered' | 'confirmed' | 'disqualified' | 'withdrawn';
  seed_position?: number;
}

export interface UpdateTournamentTeamData {
  status?: 'registered' | 'confirmed' | 'disqualified' | 'withdrawn';
  seed_position?: number;
  final_position?: number;
  matches_played?: number;
  matches_won?: number;
  matches_lost?: number;
  matches_drawn?: number;
  points_earned?: number;
}
