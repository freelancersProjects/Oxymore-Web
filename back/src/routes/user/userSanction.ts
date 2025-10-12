import { Router } from "express";
import {
  getAllUserSanctions,
  createUserSanction,
  deleteUserSanction,
} from "../../controllers/user/userSanctionController";

const router = Router();

/**
 * @openapi
 * /api/user-sanctions:
 *   get:
 *     tags:
 *       - UserSanctions
 *     summary: Récupère toutes les sanctions utilisateur
 *     responses:
 *       200:
 *         description: Liste des sanctions
 */
router.get("/", getAllUserSanctions);

/**
 * @openapi
 * /api/user-sanctions:
 *   post:
 *     tags:
 *       - UserSanctions
 *     summary: Crée une sanction utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserSanctionInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSanctionInput'
 *     responses:
 *       201:
 *         description: Sanction créée
 */
router.post("/", createUserSanction);

/**
 * @openapi
 * /api/user-sanctions/{id}:
 *   delete:
 *     tags:
 *       - UserSanctions
 *     summary: Supprime une sanction utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Sanction supprimée
 */
router.delete("/:id", deleteUserSanction);

export default router;
