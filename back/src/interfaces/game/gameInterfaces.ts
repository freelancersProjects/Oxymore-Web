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

export interface Map {
  id_map: string;
  map_name: string;
  image_url?: string;
}

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



