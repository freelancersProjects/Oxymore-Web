/**
 * @openapi
 * components:
 *   schemas:
 *     GroupInput:
 *       type: object
 *       required:
 *         - group_name
 *         - id_owner
 *       properties:
 *         group_name:
 *           type: string
 *         description:
 *           type: string
 *         is_private:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         id_owner:
 *           type: string
 */

import { Group } from '../../interfaces/group/groupInterfaces';

export { Group };
