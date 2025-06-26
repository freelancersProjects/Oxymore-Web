import { Router } from "express";
import {
  getAllChannels,
  getChannelById,
  getChannelsByUserId,
  createChannel,
  updateChannelName,
  deleteChannel,
} from "../controllers/channelController";

const router = Router();

/**
 * @openapi
 * /api/channels:
 *   get:
 *     tags:
 *       - Channels
 *     summary: Récupère les channels d'un utilisateur
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des channels
 */
router.get("/", getChannelsByUserId);

/**
 * @openapi
 * /api/channels/{id}:
 *   get:
 *     tags:
 *       - Channels
 *     summary: Récupère un channel par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel trouvé
 *       404:
 *         description: Channel non trouvé
 */
router.get("/:id", getChannelById);

/**
 * @openapi
 * /api/channels:
 *   post:
 *     tags:
 *       - Channels
 *     summary: Crée un nouveau channel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - user_id
 *             properties:
 *               name:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Channel créé
 */
router.post("/", createChannel);

/**
 * @openapi
 * /api/channels/{id}:
 *   patch:
 *     tags:
 *       - Channels
 *     summary: Met à jour le nom d'un channel
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Channel mis à jour
 */
router.patch("/:id", updateChannelName);

/**
 * @openapi
 * /api/channels/{id}:
 *   delete:
 *     tags:
 *       - Channels
 *     summary: Supprime un channel par son id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel supprimé
 */
router.delete("/:id", deleteChannel);

export default router;
