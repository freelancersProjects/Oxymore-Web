/**
 * @openapi
 * components:
 *   schemas:
 *     TeamInput:
 *       type: object
 *       required:
 *         - team_name
 *         - id_captain
 *       properties:
 *         team_name:
 *           type: string
 *         team_logo_url:
 *           type: string
 *         team_banner_url:
 *           type: string
 *         description:
 *           type: string
 *         max_members:
 *           type: integer
 *         id_captain:
 *           type: string
 */

export interface Team {
  id_team: string;
  team_name: string;
  team_logo_url?: string;
  team_banner_url?: string;
  description?: string;
  max_members?: number;
  id_captain: string;
}
