import { Router } from "express";
import {
  getAllGroupMembers,
  getGroupMembersByGroupId,
  getPendingInvitationsByUserId,
  createGroupMember,
  updateGroupMemberStatus,
  inviteFriendToGroup,
  deleteGroupMember,
} from "../../controllers/group/groupMemberController";

const router = Router();

/**
 * @openapi
 * /api/group-members:
 *   get:
 *     tags:
 *       - GroupMembers
 *     summary: Récupère tous les membres de groupe
 *     responses:
 *       200:
 *         description: Liste des membres
 */
router.get("/", getAllGroupMembers);

/**
 * @openapi
 * /api/group-members/group/{groupId}:
 *   get:
 *     tags:
 *       - GroupMembers
 *     summary: Récupère tous les membres d'un groupe spécifique
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des membres du groupe
 */
router.get("/group/:groupId", getGroupMembersByGroupId);

/**
 * @openapi
 * /api/group-members/invitations/{userId}:
 *   get:
 *     tags:
 *       - GroupMembers
 *     summary: Récupère toutes les invitations en attente d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des invitations en attente
 */
router.get("/invitations/:userId", getPendingInvitationsByUserId);

/**
 * @openapi
 * /api/group-members:
 *   post:
 *     tags:
 *       - GroupMembers
 *     summary: Ajoute un membre à un groupe
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/GroupMemberInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupMemberInput'
 *     responses:
 *       201:
 *         description: Membre ajouté
 */
router.post("/", createGroupMember);

/**
 * @openapi
 * /api/group-members/{id}/status:
 *   put:
 *     tags:
 *       - GroupMembers
 *     summary: Met à jour le statut d'une invitation de groupe
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
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       400:
 *         description: Statut invalide
 *       404:
 *         description: Membre non trouvé
 */
router.put("/:id/status", updateGroupMemberStatus);

/**
 * @openapi
 * /api/group-members/{groupId}/invite/{userId}:
 *   post:
 *     tags:
 *       - GroupMembers
 *     summary: Invite un ami à rejoindre un groupe
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [member, admin]
 *                 default: member
 *     responses:
 *       201:
 *         description: Invitation créée
 *       409:
 *         description: Utilisateur déjà invité
 */
router.post("/:groupId/invite/:userId", inviteFriendToGroup);

/**
 * @openapi
 * /api/group-members/{id}:
 *   delete:
 *     tags:
 *       - GroupMembers
 *     summary: Supprime un membre de groupe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Membre supprimé
 */
router.delete("/:id", deleteGroupMember);

export default router;
