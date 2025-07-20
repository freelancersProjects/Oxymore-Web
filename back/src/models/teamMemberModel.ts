/**
 * @openapi
 * components:
 *   schemas:
 *     TeamMemberInput:
 *       type: object
 *       required:
 *         - role
 *         - id_team
 *         - id_user
 *       properties:
 *         role:
 *           type: string
 *         included_in_team_premium:
 *           type: boolean
 *         join_date:
 *           type: string
 *           format: date-time
 *         id_team:
 *           type: string
 *         id_user:
 *           type: string
 */

export interface TeamMember {
  id_team_member: string;
  role: string;
  included_in_team_premium?: boolean;
  join_date?: string;
  id_team: string;
  id_user: string;
}
