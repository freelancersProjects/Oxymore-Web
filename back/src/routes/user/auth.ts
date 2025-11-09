import { Router } from "express";
import type { Handler } from "express";
import { register, login, getProfile, sendVerificationEmailController, verifyEmail } from "../../controllers/user/authController";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post("/register", register as Handler);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Connexion d'un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Identifiants invalides
 */
router.post("/login", login as Handler);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Récupérer le profil complet de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré avec succès
 *       401:
 *         description: Non autorisé
 */
router.get("/profile", authenticateToken, getProfile as Handler);

/**
 * @openapi
 * /api/auth/send-verification-email:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Envoyer un email de vérification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email de vérification envoyé avec succès
 *       400:
 *         description: Email déjà vérifié
 *       401:
 *         description: Non autorisé
 */
router.post("/send-verification-email", authenticateToken, sendVerificationEmailController as Handler);

/**
 * @openapi
 * /api/auth/verify-email:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Vérifier l'email via un token
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email vérifié avec succès
 *       400:
 *         description: Token invalide ou expiré
 */
router.get("/verify-email", verifyEmail as Handler);

export default router;
