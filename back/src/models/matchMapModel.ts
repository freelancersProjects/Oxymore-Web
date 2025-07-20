/**
 * @openapi
 * components:
 *   schemas:
 *     MatchMapInput:
 *       type: object
 *       required:
 *         - id_match
 *         - id_map
 *       properties:
 *         map_order:
 *           type: integer
 *         id_match:
 *           type: string
 *         id_map:
 *           type: string
 *         picked_by:
 *           type: string
 *         winner_team:
 *           type: string
 */

export interface MatchMap {
  id_match_map: string;
  map_order?: number;
  id_match: string;
  id_map: string;
  picked_by?: string;
  winner_team?: string;
}
