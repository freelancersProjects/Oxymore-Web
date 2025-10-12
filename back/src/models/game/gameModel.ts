/**
 * @openapi
 * components:
 *   schemas:
 *     GameInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

import { Game } from '../../interfaces/game/gameInterfaces';

export { Game };
