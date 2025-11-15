import { Router } from "express";
import {
  getAllFavoriteFriends,
  getFavoriteFriendsByUserId,
  getFavoriteFriendById,
  createFavoriteFriend,
  deleteFavoriteFriend,
  toggleFavoriteFriend,
} from "../../controllers/user/favoriteFriendController";

const router = Router();

/**
 * @openapi
 * /api/favorite-friends:
 *   get:
 *     tags:
 *       - Favorite Friends
 *     summary: Récupère tous les favoris
 *     responses:
 *       200:
 *         description: Liste des favoris
 */
router.get("/", getAllFavoriteFriends);

/**
 * @openapi
 * /api/favorite-friends/user/{userId}:
 *   get:
 *     tags:
 *       - Favorite Friends
 *     summary: Récupère les favoris d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des favoris de l'utilisateur
 */
router.get("/user/:userId", getFavoriteFriendsByUserId);

/**
 * @openapi
 * /api/favorite-friends/{id}:
 *   get:
 *     tags:
 *       - Favorite Friends
 *     summary: Récupère un favori par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favori trouvé
 *       404:
 *         description: Favori non trouvé
 */
router.get("/:id", getFavoriteFriendById);

/**
 * @openapi
 * /api/favorite-friends:
 *   post:
 *     tags:
 *       - Favorite Friends
 *     summary: Crée un favori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FavoriteFriendInput'
 *     responses:
 *       201:
 *         description: Favori créé
 */
router.post("/", createFavoriteFriend);

/**
 * @openapi
 * /api/favorite-friends/{id}:
 *   delete:
 *     tags:
 *       - Favorite Friends
 *     summary: Supprime un favori
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Favori supprimé
 *       404:
 *         description: Favori non trouvé
 */
router.delete("/:id", deleteFavoriteFriend);

/**
 * @openapi
 * /api/favorite-friends/{userId}/{friendId}/toggle:
 *   post:
 *     tags:
 *       - Favorite Friends
 *     summary: Toggle le statut favori d'un ami
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut favori mis à jour
 */
router.post("/:userId/:friendId/toggle", toggleFavoriteFriend);

export default router;






