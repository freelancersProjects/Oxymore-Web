import { Router } from "express";
import {
  getAllFirstPagePromotionVideos,
  createFirstPagePromotionVideo,
  deleteFirstPagePromotionVideo,
} from "../../controllers/content/firstPagePromotionVideoController";

const router = Router();

/**
 * @openapi
 * /api/first-page-promotion-videos:
 *   get:
 *     tags:
 *       - FirstPagePromotionVideos
 *     summary: Récupère toutes les vidéos de promotion de première page
 *     responses:
 *       200:
 *         description: Liste des vidéos de promotion
 */
router.get("/", getAllFirstPagePromotionVideos);

/**
 * @openapi
 * /api/first-page-promotion-videos:
 *   post:
 *     tags:
 *       - FirstPagePromotionVideos
 *     summary: Ajoute une vidéo de promotion de première page
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/FirstPagePromotionVideoInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FirstPagePromotionVideoInput'
 *     responses:
 *       201:
 *         description: Vidéo ajoutée
 */
router.post("/", createFirstPagePromotionVideo);

/**
 * @openapi
 * /api/first-page-promotion-videos/{id}:
 *   delete:
 *     tags:
 *       - FirstPagePromotionVideos
 *     summary: Supprime une vidéo de promotion de première page
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Vidéo supprimée
 */
router.delete("/:id", deleteFirstPagePromotionVideo);

export default router;
