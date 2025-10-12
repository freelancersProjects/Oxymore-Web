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

import { ShopItem } from '../../interfaces/shop/shopInterfaces';

export { ShopItem };
