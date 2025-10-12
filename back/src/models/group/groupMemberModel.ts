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
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *           default: pending
 *         id_group:
 *           type: string
 *         id_user:
 *           type: string
 */

import { GroupMember } from '../../interfaces/group/groupInterfaces';

export { GroupMember };
