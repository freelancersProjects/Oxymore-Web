import { Router } from "express";
import { uploadImage } from "../../controllers/cloudinary/cloudinaryController";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

/**
 * @openapi
 * /api/cloudinary/upload:
 *   post:
 *     tags:
 *       - Cloudinary
 *     summary: Upload une image vers Cloudinary depuis base64
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 description: Image en base64 (data:image/jpeg;base64,...)
 *               folder:
 *                 type: string
 *                 description: Dossier dans Cloudinary (optionnel)
 *               type:
 *                 type: string
 *                 enum: [avatar, banner]
 *                 description: Type d'image (optionnel, détermine le folder par défaut)
 *     responses:
 *       200:
 *         description: Image uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL sécurisée de l'image
 *                 public_id:
 *                   type: string
 *                   description: Public ID de l'image sur Cloudinary
 *       400:
 *         description: Image manquante
 *       500:
 *         description: Erreur serveur
 */
router.post("/upload", authenticateToken, uploadImage);

export default router;

