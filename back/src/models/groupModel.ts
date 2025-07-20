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

export interface Group {
  id_group: string;
  group_name: string;
  description?: string;
  is_private?: boolean;
  created_at?: string;
  id_owner: string;
}
