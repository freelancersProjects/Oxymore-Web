/**
 * @openapi
 * components:
 *   schemas:
 *     MatchInput:
 *       type: object
 *       required:
 *         - score_team1
 *         - score_team2
 *         - match_date
 *         - status
 *         - id_tournament
 *         - id_team1
 *         - id_team2
 *       properties:
 *         score_team1:
 *           type: integer
 *         score_team2:
 *           type: integer
 *         match_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *         is_streamed:
 *           type: boolean
 *         id_tournament:
 *           type: string
 *         id_team1:
 *           type: string
 *         id_team2:
 *           type: string
 *         id_winner_team:
 *           type: string
 */

import { Match } from '../../interfaces/match/matchInterfaces';

export { Match };
