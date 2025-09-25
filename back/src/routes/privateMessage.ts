import { Router, RequestHandler } from 'express';
import {
  sendPrivateMessage,
  getPrivateMessages,
  getConversations,
  getPrivateMessage,
  deleteMessage
} from '../controllers/privateMessageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/private-messages:
 *   post:
 *     tags:
 *       - Private Messages
 *     summary: Envoyer un message privé
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - receiver_id
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 500
 *               receiver_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message envoyé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authenticateToken, sendPrivateMessage as RequestHandler);

/**
 * @openapi
 * /api/private-messages/conversations:
 *   get:
 *     tags:
 *       - Private Messages
 *     summary: Récupérer toutes les conversations de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des conversations
 *       500:
 *         description: Erreur serveur
 */
router.get('/conversations', authenticateToken, getConversations as RequestHandler);

/**
 * @openapi
 * /api/private-messages/{friendId}:
 *   get:
 *     tags:
 *       - Private Messages
 *     summary: Récupérer les messages entre deux utilisateurs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des messages
 *       500:
 *         description: Erreur serveur
 */
router.get('/:friendId', authenticateToken, getPrivateMessages as RequestHandler);

/**
 * @openapi
 * /api/private-messages/message/{id}:
 *   get:
 *     tags:
 *       - Private Messages
 *     summary: Récupérer un message spécifique
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message trouvé
 *       404:
 *         description: Message non trouvé
 */
router.get('/message/:id', authenticateToken, getPrivateMessage as RequestHandler);

/**
 * @openapi
 * /api/private-messages/{id}:
 *   delete:
 *     tags:
 *       - Private Messages
 *     summary: Supprimer un message
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message supprimé avec succès
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Message non trouvé
 */
router.delete('/:id', authenticateToken, deleteMessage as RequestHandler);

export default router;


