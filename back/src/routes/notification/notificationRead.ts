import { Router } from "express";
import {
  getAllNotificationReads,
  createNotificationRead,
  deleteNotificationRead,
} from "../../controllers/notification/notificationReadController";

const router = Router();

/**
 * @openapi
 * /api/notification-reads:
 *   get:
 *     tags:
 *       - NotificationReads
 *     summary: Récupère tous les liens notification_read
 *     responses:
 *       200:
 *         description: Liste des liens notification_read
 */
router.get("/", getAllNotificationReads);

/**
 * @openapi
 * /api/notification-reads:
 *   post:
 *     tags:
 *       - NotificationReads
 *     summary: Ajoute un lien notification_read
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/NotificationReadInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationReadInput'
 *     responses:
 *       201:
 *         description: Lien ajouté
 */
router.post("/", createNotificationRead);

/**
 * @openapi
 * /api/notification-reads/{id}:
 *   delete:
 *     tags:
 *       - NotificationReads
 *     summary: Supprime un lien notification_read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Lien supprimé
 */
router.delete("/:id", deleteNotificationRead);

export default router;
