/**
 * @openapi
 * components:
 *   schemas:
 *     MapInput:
 *       type: object
 *       required:
 *         - map_name
 *         - map_code
 *       properties:
 *         map_name:
 *           type: string
 *         map_code:
 *           type: string
 *         image_url:
 *           type: string
 */

export interface Map {
  id_map: string;
  map_name: string;
  map_code: string;
  image_url?: string;
}
