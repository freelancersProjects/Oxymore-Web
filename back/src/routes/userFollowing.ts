import { Router } from "express";
import {
  getAllUserFollowings,
  createUserFollowing,
  deleteUserFollowing,
} from "../controllers/userFollowingController";

const router = Router();

/**
 * @openapi
 * /api/user-followings:
 *   get:
 *     tags:
 *       - UserFollowings
 *     summary: Récupère tous les liens user-following
 *     responses:
 *       200:
 *         description: Liste des liens
 */
router.get("/", getAllUserFollowings);

/**
 * @openapi
 * /api/user-followings:
 *   post:
 *     tags:
 *       - UserFollowings
 *     summary: Ajoute un lien user-following
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserFollowingInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserFollowingInput'
 *     responses:
 *       201:
 *         description: Lien ajouté
 */
router.post("/", createUserFollowing);

/**
 * @openapi
 * /api/user-followings/{id}:
 *   delete:
 *     tags:
 *       - UserFollowings
 *     summary: Supprime un lien user-following
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Lien supprimé
 */
router.delete("/:id", deleteUserFollowing);

export default router;
