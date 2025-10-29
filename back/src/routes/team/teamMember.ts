import { Router } from "express";
import {
  getAllTeamMembers,
  createTeamMember,
  deleteTeamMember,
  getUserTeamByUserId,
  getTeamMembersByTeamId,
  updateTeamMemberRole,
} from "../../controllers/team/teamMemberController";

const router = Router();

/**
 * @openapi
 * /api/team-members:
 *   get:
 *     tags:
 *       - TeamMembers
 *     summary: Récupère tous les membres d'équipe
 *     responses:
 *       200:
 *         description: Liste des membres
 */
router.get("/", getAllTeamMembers);

/**
 * @openapi
 * /api/team-members:
 *   post:
 *     tags:
 *       - TeamMembers
 *     summary: Ajoute un membre à une équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/TeamMemberInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamMemberInput'
 *     responses:
 *       201:
 *         description: Membre ajouté
 */
router.post("/", createTeamMember);

router.get("/user/:id_user", getUserTeamByUserId);

router.get("/team/:id_team", getTeamMembersByTeamId);

/**
 * @openapi
 * /api/team-members/{id}:
 *   delete:
 *     tags:
 *       - TeamMembers
 *     summary: Supprime un membre d'équipe
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
router.delete("/:id", deleteTeamMember);

/**
 * @openapi
 * /api/team-members/{id}/role:
 *   patch:
 *     tags:
 *       - TeamMembers
 *     summary: Met à jour le rôle d'un membre d'équipe
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
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [captain, admin, member]
 *     responses:
 *       200:
 *         description: Rôle mis à jour avec succès
 */
router.patch("/:id/role", updateTeamMemberRole);

export default router;
