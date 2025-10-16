/**
 * @openapi
 * components:
 *   schemas:
 *     MapPickbanInput:
 *       type: object
 *       required:
 *         - action
 *         - order
 *         - id_match
 *         - id_team
 *         - id_map
 *       properties:
 *         action:
 *           type: string
 *         order:
 *           type: integer
 *         id_match:
 *           type: string
 *         id_team:
 *           type: string
 *         id_map:
 *           type: string
 */

export interface MapPickban {
  id_map_pickban: string;
  action: string;
  order: number;
  id_match: string;
  id_team: string;
  id_map: string;
}
