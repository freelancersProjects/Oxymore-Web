/**
 * @openapi
 * components:
 *   schemas:
 *     LeagueInput:
 *       type: object
 *       required:
 *         - league_name
 *       properties:
 *         league_name:
 *           type: string
 *         max_teams:
 *           type: integer
 *         start_date:
 *           type: string
 *           format: date-time
 *         end_date:
 *           type: string
 *           format: date-time
 *         promotion_slots:
 *           type: integer
 *         relegation_slots:
 *           type: integer
 *         image_url:
 *           type: string
 *         entry_type:
 *           type: string
 *         id_badge_champion:
 *           type: string
 */

export interface League {
  id_league: string;
  league_name: string;
  max_teams?: number;
  start_date?: string;
  end_date?: string;
  promotion_slots?: number;
  relegation_slots?: number;
  image_url?: string;
  entry_type?: string; // 'tournament' | 'promotion'
  id_badge_champion?: string;
}
