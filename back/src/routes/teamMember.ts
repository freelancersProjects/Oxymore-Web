import { Router } from "express";
import {
  getAllTeamMembers,
  createTeamMember,
  deleteTeamMember,
} from "../controllers/teamMemberController";

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

export default router;
