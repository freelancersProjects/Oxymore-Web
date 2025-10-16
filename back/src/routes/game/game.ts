import { Router } from 'express';
import { getAllGamesController, getGameByIdController } from '../../controllers/game/gameController';

const router = Router();

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Get all games
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: List of all games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Game unique identifier
 *                   name:
 *                     type: string
 *                     description: Game name
 *                   description:
 *                     type: string
 *                     description: Game description
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllGamesController);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Get game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Game unique identifier
 *     responses:
 *       200:
 *         description: Game details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Game unique identifier
 *                 name:
 *                   type: string
 *                   description: Game name
 *                 description:
 *                   type: string
 *                   description: Game description
 *       400:
 *         description: Bad request - Game ID is required
 *       404:
 *         description: Game not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getGameByIdController);

export default router;
