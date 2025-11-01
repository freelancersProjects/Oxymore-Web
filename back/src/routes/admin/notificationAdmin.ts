import { Router } from "express";
import {
  getAllNotificationAdmins,
  getUnreadNotificationAdminsCount,
  createNotificationAdmin,
  markNotificationAdminAsRead,
  markAllNotificationAdminsAsRead,
  deleteNotificationAdmin,
  getNotificationAdminById,
} from "../../controllers/admin/notificationAdminController";

const router = Router();

/**
 * @openapi
 * /api/admin/notifications:
 *   get:
 *     tags:
 *       - NotificationAdmins
 *     summary: Récupère toutes les notifications admin
 *     responses:
 *       200:
 *         description: Liste des notifications admin
 */
router.get("/", getAllNotificationAdmins);

/**
 * @openapi
 * /api/admin/notifications/unread-count:
 *   get:
 *     tags:
 *       - NotificationAdmins
 *     summary: Récupère le nombre de notifications admin non lues
 *     responses:
 *       200:
 *         description: Nombre de notifications non lues
 */
router.get("/unread-count", getUnreadNotificationAdminsCount);

/**
 * @openapi
 * /api/admin/notifications:
 *   post:
 *     tags:
 *       - NotificationAdmins
 *     summary: Crée une nouvelle notification admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationAdminInput'
 *     responses:
 *       201:
 *         description: Notification créée avec succès
 *       400:
 *         description: Données invalides
 */
router.post("/", createNotificationAdmin);

/**
 * @openapi
 * /api/admin/notifications/{notificationId}/mark-read:
 *   post:
 *     tags:
 *       - NotificationAdmins
 *     summary: Marque une notification admin comme lue
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 */
router.post("/:notificationId/mark-read", markNotificationAdminAsRead);

/**
 * @openapi
 * /api/admin/notifications/mark-all-read:
 *   post:
 *     tags:
 *       - NotificationAdmins
 *     summary: Marque toutes les notifications admin comme lues
 *     responses:
 *       200:
 *         description: Toutes les notifications marquées comme lues
 */
router.post("/mark-all-read", markAllNotificationAdminsAsRead);

/**
 * @openapi
 * /api/admin/notifications/{notificationId}:
 *   delete:
 *     tags:
 *       - NotificationAdmins
 *     summary: Supprime une notification admin
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification supprimée
 */
router.delete("/:notificationId", deleteNotificationAdmin);

/**
 * @openapi
 * /api/admin/notifications/{notificationId}:
 *   get:
 *     tags:
 *       - NotificationAdmins
 *     summary: Récupère une notification admin par son ID
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification admin
 *       404:
 *         description: Notification non trouvée
 */
router.get("/:notificationId", getNotificationAdminById);

export default router;

