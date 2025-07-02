import { Router } from "express";
import {
  getAllNotifications,
  getNotificationsByUserId,
  getUnreadNotificationsCount,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController";

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - text
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [message, success, alert]
 *               title:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification créée
 *       400:
 *         description: Données invalides
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
 *           type: integer
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
 *           type: integer
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
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification supprimée pour l'utilisateur
 *       400:
 *         description: ID invalide
 */
router.delete("/user/:userId/:notificationId", require("../controllers/notificationController").deleteNotificationForUser);

export default router; 