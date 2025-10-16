import { Router } from "express";
import {
  getAllUserVideos,
  createUserVideo,
  deleteUserVideo,
} from "../../controllers/user/userVideoController";

const router = Router();

/**
 * @openapi
 * /api/user-videos:
 *   get:
 *     tags:
 *       - UserVideos
 *     summary: Récupère toutes les vidéos utilisateur
 *     responses:
 *       200:
 *         description: Liste des vidéos utilisateur
 */
router.get("/", getAllUserVideos);

/**
 * @openapi
 * /api/user-videos:
 *   post:
 *     tags:
 *       - UserVideos
 *     summary: Ajoute une vidéo utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserVideoInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserVideoInput'
 *     responses:
 *       201:
 *         description: Vidéo ajoutée
 */
router.post("/", createUserVideo);

/**
 * @openapi
 * /api/user-videos/{id}:
 *   delete:
 *     tags:
 *       - UserVideos
 *     summary: Supprime une vidéo utilisateur
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
router.delete("/:id", deleteUserVideo);

export default router;
