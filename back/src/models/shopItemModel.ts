/**
 * @openapi
 * components:
 *   schemas:
 *     ShopItemInput:
 *       type: object
 *       required:
 *         - item_name
 *         - price_eur
 *       properties:
 *         item_name:
 *           type: string
 *         image_url:
 *           type: string
 *         price_eur:
 *           type: number
 *         percentage_premium:
 *           type: integer
 *         external_url:
 *           type: string
 */

export interface ShopItem {
  id_item: string;
  item_name: string;
  image_url?: string;
  price_eur: number;
  percentage_premium?: number;
  external_url?: string;
}
