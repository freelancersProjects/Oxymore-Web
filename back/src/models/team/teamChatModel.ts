/**
 * @openapi
 * components:
 *   schemas:
 *     TeamChatInput:
 *       type: object
 *       required:
 *         - message
 *         - id_team
 *         - id_user
 *       properties:
 *         message:
 *           type: string
 *         sent_at:
 *           type: string
 *           format: date-time
 *         id_team:
 *           type: string
 *         id_user:
 *           type: string
 */

import { TeamChat } from '../../interfaces/team/teamInterfaces';

export { TeamChat };
