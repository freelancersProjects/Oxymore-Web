import { Router } from "express";
import {
  getAllGroups,
  createGroup,
  deleteGroup,
} from "../controllers/groupController";

const router = Router();

/**
 * @openapi
 * /api/groups:
 *   get:
 *     tags:
 *       - Groups
 *     summary: Récupère tous les groupes
 *     responses:
 *       200:
 *         description: Liste des groupes
 */
router.get("/", getAllGroups);

/**
 * @openapi
 * /api/groups:
 *   post:
 *     tags:
 *       - Groups
 *     summary: Crée un groupe
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/GroupInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupInput'
 *     responses:
 *       201:
 *         description: Groupe créé
 */
router.post("/", createGroup);

/**
 * @openapi
 * /api/groups/{id}:
 *   delete:
 *     tags:
 *       - Groups
 *     summary: Supprime un groupe
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Groupe supprimé
 */
router.delete("/:id", deleteGroup);

export default router;
