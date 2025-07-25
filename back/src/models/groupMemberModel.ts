/**
 * @openapi
 * components:
 *   schemas:
 *     GroupMemberInput:
 *       type: object
 *       required:
 *         - id_group
 *         - id_user
 *         - role
 *       properties:
 *         join_date:
 *           type: string
 *           format: date-time
 *         role:
 *           type: string
 *           enum: [member, admin, owner]
 *         id_group:
 *           type: string
 *         id_user:
 *           type: string
 */

export interface GroupMember {
  id_group_member: string;
  join_date?: string;
  role: 'member' | 'admin' | 'owner';
  id_group: string;
  id_user: string;
}
