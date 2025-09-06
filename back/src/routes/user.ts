import { Router } from "express";
import type { Handler } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  togglePremiumStatus,
} from "../controllers/userController";
import { getUserStats, refreshUserStats } from "../controllers/userStatsController";

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
 * /api/users/stats:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère les statistiques utilisateurs avec comparaison
 *     responses:
 *       200:
 *         description: Statistiques utilisateurs avec tendances
 */
router.get("/stats", getUserStats as Handler);

/**
 * @openapi
 * /api/users/stats/refresh:
 *   post:
 *     tags:
 *       - Users
 *     summary: Force la mise à jour des statistiques utilisateurs
 *     responses:
 *       200:
 *         description: Statistiques utilisateurs mises à jour
 */
router.post("/stats/refresh", refreshUserStats as Handler);

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

/**
 * @openapi
 * /api/users/{id}/premium:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Modifie le statut premium d'un utilisateur
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
 *             type: object
 *             properties:
 *               is_premium:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Statut premium modifié
 *       404:
 *         description: Utilisateur non trouvé
 */
router.patch("/:id/premium", togglePremiumStatus as Handler);

export default router;
