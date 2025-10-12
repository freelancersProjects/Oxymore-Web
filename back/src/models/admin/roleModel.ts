/**
 * @openapi
 * components:
 *   schemas:
 *     RoleInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     RoleUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

import { Role } from '../../interfaces/admin/roleInterfaces';

export { Role };
