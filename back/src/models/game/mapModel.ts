/**
 * @openapi
 * components:
 *   schemas:
 *     MapInput:
 *       type: object
 *       required:
 *         - map_name
 *       properties:
 *         map_name:
 *           type: string
 *         image_url:
 *           type: string
 */

import { Map } from '../../interfaces/game/gameInterfaces';

export { Map };
