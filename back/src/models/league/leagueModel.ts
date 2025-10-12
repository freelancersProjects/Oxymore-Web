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

import { League } from '../../interfaces/league/leagueInterfaces';

export { League };
