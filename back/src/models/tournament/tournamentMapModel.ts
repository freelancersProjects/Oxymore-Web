/**
 * @openapi
 * components:
 *   schemas:
 *     TournamentMapInput:
 *       type: object
 *       required:
 *         - id_tournament
 *         - id_map
 *       properties:
 *         id_tournament:
 *           type: string
 *         id_map:
 *           type: string
 */

export interface TournamentMap {
  id_tournament_map: string;
  id_tournament: string;
  id_map: string;
}
