import { Router } from "express";
import {
  getAllVideoComments,
  createVideoComment,
  deleteVideoComment,
} from "../../controllers/content/videoCommentController";

const router = Router();

/**
 * @openapi
 * /api/video-comments:
 *   get:
 *     tags:
 *       - VideoComments
 *     summary: Récupère tous les commentaires de vidéo
 *     responses:
 *       200:
 *         description: Liste des commentaires
 */
router.get("/", getAllVideoComments);

/**
 * @openapi
 * /api/video-comments:
 *   post:
 *     tags:
 *       - VideoComments
 *     summary: Ajoute un commentaire de vidéo
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/VideoCommentInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VideoCommentInput'
 *     responses:
 *       201:
 *         description: Commentaire ajouté
 */
router.post("/", createVideoComment);

/**
 * @openapi
 * /api/video-comments/{id}:
 *   delete:
 *     tags:
 *       - VideoComments
 *     summary: Supprime un commentaire de vidéo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Commentaire supprimé
 */
router.delete("/:id", deleteVideoComment);

export default router;
