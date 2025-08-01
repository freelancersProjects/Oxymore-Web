/**
 * @openapi
 * components:
 *   schemas:
 *     TournamentInput:
 *       type: object
 *       required:
 *         - tournament_name
 *         - type
 *         - format
 *         - structure
 *         - start_date
 *         - end_date
 *         - id_league
 *       properties:
 *         tournament_name:
 *           type: string
 *         organized_by:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *         format:
 *           type: string
 *         structure:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date-time
 *         end_date:
 *           type: string
 *           format: date-time
 *         check_in_date:
 *           type: string
 *           format: date-time
 *         cash_prize:
 *           type: integer
 *         entry_fee:
 *           type: number
 *         max_participant:
 *           type: integer
 *         min_participant:
 *           type: integer
 *         is_premium:
 *           type: boolean
 *         image_url:
 *           type: string
 *         id_league:
 *           type: string
 *         id_badge_winner:
 *           type: string
 */

export interface Tournament {
  id_tournament: string;
  tournament_name: string;
  organized_by?: string;
  description?: string;
  type: string; // 'ligue' | 'major'  | 'minor' | 'open'
  format: string; // 'BO1' | 'BO3' | 'BO5'
  structure: string;
  start_date: string;
  end_date: string;
  check_in_date?: string;
  cash_prize?: number;
  entry_fee?: number;
  max_participant?: number;
  min_participant?: number;
  is_premium?: boolean;
  image_url?: string;
  id_league: string;
  id_badge_winner?: string;
}
