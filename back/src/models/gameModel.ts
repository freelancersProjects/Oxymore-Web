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

export interface Game {
  id: string;
  name: string;
  description?: string;
}
