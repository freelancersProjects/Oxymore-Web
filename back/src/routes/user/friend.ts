import { Router } from "express";
import {
  getAllFriends,
  getFriendsByUserId,
  getPendingFriendRequests,
  getSentFriendRequests,
  getFriendById,
  createFriend,
  updateFriend,
  deleteFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  blockUser,
  searchUsersForFriends,
  updateFriendDisplayName,
  deleteFriendDisplayName,
} from "../../controllers/user/friendController";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

/**
 * @openapi
 * /api/friends:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Récupère tous les amis
 *     responses:
 *       200:
 *         description: Liste des amis
 */
router.get("/", getAllFriends);

/**
 * @openapi
 * /api/friends/user/{userId}:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Récupère les amis d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des amis de l'utilisateur
 */
router.get("/user/:userId", getFriendsByUserId);

/**
 * @openapi
 * /api/friends/pending/{userId}:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Récupère les demandes d'ami en attente
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des demandes en attente
 */
router.get("/pending/:userId", getPendingFriendRequests);

/**
 * @openapi
 * /api/friends/sent/{userId}:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Récupère les demandes d'ami envoyées
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des demandes envoyées
 */
router.get("/sent/:userId", getSentFriendRequests);

/**
 * @openapi
 * /api/friends/search/{userId}:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Recherche des utilisateurs pour ajouter en ami
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des utilisateurs trouvés
 */
router.get("/search/:userId", searchUsersForFriends);

/**
 * @openapi
 * /api/friends/{id}:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Récupère un ami par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ami trouvé
 *       404:
 *         description: Ami non trouvé
 */
router.get("/:id", getFriendById);

/**
 * @openapi
 * /api/friends:
 *   post:
 *     tags:
 *       - Friends
 *     summary: Crée une demande d'ami
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FriendInput'
 *     responses:
 *       201:
 *         description: Demande d'ami créée
 */
router.post("/", createFriend);

/**
 * @openapi
 * /api/friends/{id}:
 *   put:
 *     tags:
 *       - Friends
 *     summary: Met à jour un ami
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
 *             $ref: '#/components/schemas/FriendInput'
 *     responses:
 *       200:
 *         description: Ami mis à jour
 *       404:
 *         description: Ami non trouvé
 */
router.put("/:id", updateFriend);

/**
 * @openapi
 * /api/friends/{id}:
 *   delete:
 *     tags:
 *       - Friends
 *     summary: Supprime un ami
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ami supprimé
 *       404:
 *         description: Ami non trouvé
 */
router.delete("/:id", deleteFriend);

/**
 * @openapi
 * /api/friends/{id}/accept:
 *   put:
 *     tags:
 *       - Friends
 *     summary: Accepte une demande d'ami
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Demande acceptée
 *       404:
 *         description: Demande non trouvée
 */
router.put("/:id/accept", acceptFriendRequest);

/**
 * @openapi
 * /api/friends/{id}/reject:
 *   put:
 *     tags:
 *       - Friends
 *     summary: Rejette une demande d'ami
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Demande rejetée
 *       404:
 *         description: Demande non trouvée
 */
router.put("/:id/reject", rejectFriendRequest);
router.delete("/:id/cancel", cancelFriendRequest);

/**
 * @openapi
 * /api/friends/{id}/block:
 *   put:
 *     tags:
 *       - Friends
 *     summary: Bloque un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur bloqué
 *       404:
 *         description: Ami non trouvé
 */
router.put("/:id/block", blockUser);

/**
 * @openapi
 * /api/friends/{userId}/{friendId}/display-name:
 *   put:
 *     tags:
 *       - Friends
 *     summary: Met à jour le nom d'affichage d'un ami
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: friendId
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
 *               display_name:
 *                 type: string
 *             required:
 *               - display_name
 *     responses:
 *       200:
 *         description: Nom d'affichage mis à jour
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Ami non trouvé
 */
router.put("/:userId/:friendId/display-name", authenticateToken, updateFriendDisplayName);

/**
 * @openapi
 * /api/friends/{userId}/{friendId}/display-name:
 *   delete:
 *     tags:
 *       - Friends
 *     summary: Supprime le nom d'affichage personnalisé d'un ami
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Nom d'affichage supprimé
 *       404:
 *         description: Nom d'affichage non trouvé
 */
router.delete("/:userId/:friendId/display-name", authenticateToken, deleteFriendDisplayName);

export default router;
