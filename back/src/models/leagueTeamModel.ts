/**
 * @openapi
 * components:
 *   schemas:
 *     LeagueTeamInput:
 *       type: object
 *       required:
 *         - league_id
 *         - team_id
 *       properties:
 *         league_id:
 *           type: string
 *         team_id:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         matches_played:
 *           type: integer
 *         matches_won:
 *           type: integer
 *         matches_drawn:
 *           type: integer
 *         matches_lost:
 *           type: integer
 *         goals_for:
 *           type: integer
 *         goals_against:
 *           type: integer
 *         points:
 *           type: integer
 *         current_position:
 *           type: integer
 */

export interface LeagueTeam {
  id: string;
  league_id: string;
  team_id: string;
  registration_date: string;
  status: 'active' | 'inactive' | 'suspended';
  matches_played: number;
  matches_won: number;
  matches_drawn: number;
  matches_lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
  current_position: number;
  created_at: string;
  updated_at: string;
}
