import { Router } from "express";
import {
  getAllMapPickbans,
  createMapPickban,
  deleteMapPickban,
} from "../../controllers/game/mapPickbanController";

const router = Router();

/**
 * @openapi
 * /api/map-pickbans:
 *   get:
 *     tags:
 *       - MapPickbans
 *     summary: Récupère tous les map pickbans
 *     responses:
 *       200:
 *         description: Liste des map pickbans
 */
router.get("/", getAllMapPickbans);

/**
 * @openapi
 * /api/map-pickbans:
 *   post:
 *     tags:
 *       - MapPickbans
 *     summary: Crée un map pickban
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/MapPickbanInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MapPickbanInput'
 *     responses:
 *       201:
 *         description: Map pickban créé
 */
router.post("/", createMapPickban);

/**
 * @openapi
 * /api/map-pickbans/{id}:
 *   delete:
 *     tags:
 *       - MapPickbans
 *     summary: Supprime un map pickban
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Map pickban supprimé
 */
router.delete("/:id", deleteMapPickban);

export default router;
