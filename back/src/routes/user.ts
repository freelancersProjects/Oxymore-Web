import { Router } from "express";
import type { Handler } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/", getAllUsers as Handler);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère un utilisateur par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/:id", getUserById as Handler);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Crée un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post("/", createUser as Handler);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Met à jour un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put("/:id", updateUser as Handler);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprime un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete("/:id", deleteUser as Handler);

export default router;
