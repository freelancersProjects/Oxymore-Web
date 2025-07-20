import { Router } from "express";
import {
  getAllVideoLikes,
  createVideoLike,
  deleteVideoLike,
} from "../controllers/videoLikeController";

const router = Router();

/**
 * @openapi
 * /api/video-likes:
 *   get:
 *     tags:
 *       - VideoLikes
 *     summary: Récupère tous les likes de vidéo
 *     responses:
 *       200:
 *         description: Liste des likes
 */
router.get("/", getAllVideoLikes);

/**
 * @openapi
 * /api/video-likes:
 *   post:
 *     tags:
 *       - VideoLikes
 *     summary: Ajoute un like à une vidéo
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/VideoLikeInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VideoLikeInput'
 *     responses:
 *       201:
 *         description: Like ajouté
 */
router.post("/", createVideoLike);

/**
 * @openapi
 * /api/video-likes/{id}:
 *   delete:
 *     tags:
 *       - VideoLikes
 *     summary: Supprime un like de vidéo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Like supprimé
 */
router.delete("/:id", deleteVideoLike);

export default router;
