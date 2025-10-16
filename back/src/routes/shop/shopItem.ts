import { Router } from "express";
import {
  getAllShopItems,
  createShopItem,
  deleteShopItem,
} from "../../controllers/shop/shopItemController";

const router = Router();

/**
 * @openapi
 * /api/shop-items:
 *   get:
 *     tags:
 *       - ShopItems
 *     summary: Récupère tous les items de la boutique
 *     responses:
 *       200:
 *         description: Liste des items
 */
router.get("/", getAllShopItems);

/**
 * @openapi
 * /api/shop-items:
 *   post:
 *     tags:
 *       - ShopItems
 *     summary: Crée un item de boutique
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/ShopItemInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShopItemInput'
 *     responses:
 *       201:
 *         description: Item créé
 */
router.post("/", createShopItem);

/**
 * @openapi
 * /api/shop-items/{id}:
 *   delete:
 *     tags:
 *       - ShopItems
 *     summary: Supprime un item de boutique
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item supprimé
 */
router.delete("/:id", deleteShopItem);

export default router;
