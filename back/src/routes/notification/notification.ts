import { Router } from "express";
import {
  getAllNotifications,
  getNotificationsByUserId,
  getUnreadNotificationsCount,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteNotificationForUser,
} from "../../controllers/notification/notificationController";

const router = Router();

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Récupère toutes les notifications
 *     responses:
 *       200:
 *         description: Liste des notifications
 */
router.get("/", getAllNotifications);

/**
 * @openapi
 * /api/notifications/user/{userId}:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Récupère les notifications d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notifications de l'utilisateur
 */
router.get("/user/:userId", getNotificationsByUserId);

/**
 * @openapi
 * /api/notifications/user/{userId}/unread-count:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Récupère le nombre de notifications non lues d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nombre de notifications non lues
 */
router.get("/user/:userId/unread-count", getUnreadNotificationsCount);

/**
 * @openapi
 * /api/notifications:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Crée une nouvelle notification
 *     description: Crée une nouvelle notification avec un type, titre et texte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationInput'
 *           examples:
 *             messageNotification:
 *               summary: Notification de message
 *               value:
 *                 type: "message"
 *                 title: "Nouveau message"
 *                 text: "Vous avez reçu un nouveau message de Jean"
 *             successNotification:
 *               summary: Notification de succès
 *               value:
 *                 type: "success"
 *                 title: "Action réussie"
 *                 text: "Votre profil a été mis à jour avec succès"
 *             alertNotification:
 *               summary: Notification d'alerte
 *               value:
 *                 type: "alert"
 *                 title: "Attention requise"
 *                 text: "Votre session expire bientôt"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/NotificationInput'
 *     responses:
 *       201:
 *         description: Notification créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Données invalides ou champs manquants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields: type, title, text"
 *       500:
 *         description: Erreur serveur
 */
router.post("/", createNotification);

/**
 * @openapi
 * /api/notifications/user/{userId}/mark-read/{notificationId}:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Marque une notification comme lue
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 *       400:
 *         description: ID de notification invalide
 */
router.post("/user/:userId/mark-read/:notificationId", markNotificationAsRead);

/**
 * @openapi
 * /api/notifications/user/{userId}/mark-all-read:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Marque toutes les notifications d'un utilisateur comme lues
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Toutes les notifications marquées comme lues
 */
router.post("/user/:userId/mark-all-read", markAllNotificationsAsRead);

/**
 * @openapi
 * /api/notifications/{notificationId}:
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Supprime une notification
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification supprimée
 *       400:
 *         description: ID de notification invalide
 */
router.delete("/:notificationId", deleteNotification);

/**
 * @openapi
 * /api/notifications/user/{userId}/{notificationId}:
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Supprime une notification pour un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification supprimée pour l'utilisateur
 *       400:
 *         description: ID invalide
 */
router.delete("/user/:userId/:notificationId", deleteNotificationForUser);

export default router;
