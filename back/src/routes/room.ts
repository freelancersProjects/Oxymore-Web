import { Router } from "express";
import {
  getAllRooms,
  createRoom,
  deleteRoom,
} from "../controllers/roomController";

const router = Router();

/**
 * @openapi
 * /api/rooms:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Récupère toutes les rooms
 *     responses:
 *       200:
 *         description: Liste des rooms
 */
router.get("/", getAllRooms);

/**
 * @openapi
 * /api/rooms:
 *   post:
 *     tags:
 *       - Rooms
 *     summary: Crée une room
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/RoomInput'
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomInput'
 *     responses:
 *       201:
 *         description: Room créée
 */
router.post("/", createRoom);

/**
 * @openapi
 * /api/rooms/{id}:
 *   delete:
 *     tags:
 *       - Rooms
 *     summary: Supprime une room
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Room supprimée
 */
router.delete("/:id", deleteRoom);

export default router;
