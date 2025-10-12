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
 *         entry_type:
 *          type: string
 *          enum: [open, inscription, cv]
 *         id_captain:
 *           type: string
 */

import { Team } from '../../interfaces/team/teamInterfaces';

export { Team };
