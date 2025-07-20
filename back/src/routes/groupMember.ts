import { Router } from "express";
import {
  getAllGroupMembers,
  createGroupMember,
  deleteGroupMember,
} from "../controllers/groupMemberController";

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
