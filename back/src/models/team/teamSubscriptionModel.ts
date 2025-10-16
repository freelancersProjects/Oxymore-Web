/**
 * @openapi
 * components:
 *   schemas:
 *     TeamSubscriptionInput:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *         - id_team
 *         - purchased_by
 *       properties:
 *         start_date:
 *           type: string
 *           format: date-time
 *         end_date:
 *           type: string
 *           format: date-time
 *         active:
 *           type: boolean
 *         id_team:
 *           type: string
 *         purchased_by:
 *           type: string
 */

import { TeamSubscription } from '../../interfaces/team/teamInterfaces';

export { TeamSubscription };
