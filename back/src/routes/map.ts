import { Router } from "express";
import {
  getAllMaps,
  createMap,
  deleteMap,
} from "../controllers/mapController";

const router = Router();

/**
 * @openapi
 * /api/maps:
 *   get:
 *     tags:
 *       - Maps
 *     summary: Récupère toutes les maps
 *     responses:
 *       200:
 *         description: Liste des maps
 */
router.get("/", getAllMaps);

/**
 * @openapi
 * /api/maps:
 *   post:
 *     tags:
 *       - Maps
 *     summary: Crée une map
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/MapInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MapInput'
 *     responses:
 *       201:
 *         description: Map créée
 */
router.post("/", createMap);

/**
 * @openapi
 * /api/maps/{id}:
 *   delete:
 *     tags:
 *       - Maps
 *     summary: Supprime une map
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Map supprimée
 */
router.delete("/:id", deleteMap);

export default router;
