import { Router, RequestHandler } from 'express';
import {
  getAllKanbanBoards,
  getKanbanBoardById,
  createKanbanBoard,
  updateKanbanBoard,
  deleteKanbanBoard,
  getTicketsByBoard,
  getTicketById,
  createKanbanTicket,
  updateKanbanTicket,
  deleteKanbanTicket,
  getAllKanbanTags,
  createKanbanTag,
  getKanbanStats,
  getAllKanbanBoardStats,
  getAdminUsers
} from '../../controllers/kanban/kanbanController';

const router = Router();

/**
 * @openapi
 * /api/kanban/boards:
 *   get:
 *     tags:
 *       - Kanban
 *     summary: Récupère tous les tableaux Kanban
 *     responses:
 *       200:
 *         description: Liste des tableaux Kanban
 */
router.get('/boards', getAllKanbanBoards as RequestHandler);

/**
 * @openapi
 * /api/kanban/boards/{id}:
 *   get:
 *     tags:
 *       - Kanban
 *     summary: Récupère un tableau Kanban par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tableau Kanban trouvé
 *       404:
 *         description: Tableau Kanban non trouvé
 */
router.get('/boards/:id', getKanbanBoardById as RequestHandler);

/**
 * @openapi
 * /api/kanban/boards:
 *   post:
 *     tags:
 *       - Kanban
 *     summary: Crée un tableau Kanban
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KanbanBoardInput'
 *     responses:
 *       201:
 *         description: Tableau Kanban créé
 */
router.post('/boards', createKanbanBoard as RequestHandler);

/**
 * @openapi
 * /api/kanban/boards/{id}:
 *   put:
 *     tags:
 *       - Kanban
 *     summary: Met à jour un tableau Kanban
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
 *             $ref: '#/components/schemas/KanbanBoardInput'
 *     responses:
 *       200:
 *         description: Tableau Kanban mis à jour
 *       404:
 *         description: Tableau Kanban non trouvé
 */
router.put('/boards/:id', updateKanbanBoard as RequestHandler);

/**
 * @openapi
 * /api/kanban/boards/{id}:
 *   delete:
 *     tags:
 *       - Kanban
 *     summary: Supprime un tableau Kanban
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tableau Kanban supprimé
 */
router.delete('/boards/:id', deleteKanbanBoard as RequestHandler);

/**
 * @openapi
 * /api/kanban/boards/{boardId}/tickets:
 *   get:
 *     tags:
 *       - Kanban
 *     summary: Récupère tous les tickets d'un tableau Kanban
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des tickets
 */
router.get('/boards/:boardId/tickets', getTicketsByBoard as RequestHandler);

/**
 * @openapi
 * /api/kanban/tickets/{id}:
 *   get:
 *     tags:
 *       - Kanban
 *     summary: Récupère un ticket par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket trouvé
 *       404:
 *         description: Ticket non trouvé
 */
router.get('/tickets/:id', getTicketById as RequestHandler);

/**
 * @openapi
 * /api/kanban/tickets:
 *   post:
 *     tags:
 *       - Kanban
 *     summary: Crée un ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KanbanTicketInput'
 *     responses:
 *       201:
 *         description: Ticket créé
 */
router.post('/tickets', createKanbanTicket as RequestHandler);

/**
 * @openapi
 * /api/kanban/tickets/{id}:
 *   put:
 *     tags:
 *       - Kanban
 *     summary: Met à jour un ticket
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
 *             $ref: '#/components/schemas/KanbanTicketInput'
 *     responses:
 *       200:
 *         description: Ticket mis à jour
 *       404:
 *         description: Ticket non trouvé
 */
router.put('/tickets/:id', updateKanbanTicket as RequestHandler);

/**
 * @openapi
 * /api/kanban/tickets/{id}:
 *   delete:
 *     tags:
 *       - Kanban
 *     summary: Supprime un ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ticket supprimé
 */
router.delete('/tickets/:id', deleteKanbanTicket as RequestHandler);

/**
 * @openapi
 * /api/kanban/tags:
 *   get:
 *     tags:
 *       - Kanban
 *     summary: Récupère tous les tags Kanban
 *     responses:
 *       200:
 *         description: Liste des tags
 */
router.get('/tags', getAllKanbanTags as RequestHandler);

/**
 * @openapi
 * /api/kanban/tags:
 *   post:
 *     tags:
 *       - Kanban
 *     summary: Crée un tag Kanban
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KanbanTagInput'
 *     responses:
 *       201:
 *         description: Tag créé
 */
router.post('/tags', createKanbanTag as RequestHandler);

/**
 * @openapi
 * /api/kanban/stats:
 *   get:
 *     tags:
 *       - Kanban
 *     summary: Récupère les statistiques Kanban
 *     parameters:
 *       - in: query
 *         name: boardId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistiques Kanban
 */
router.get('/stats', getKanbanStats as RequestHandler);

/**
 * @openapi
 * /api/kanban/stats/boards:
 *   get:
 *     tags:
 *       - Kanban
 *     summary: Récupère les statistiques de tous les tableaux Kanban
 *     responses:
 *       200:
 *         description: Statistiques des tableaux Kanban
 */
router.get('/stats/boards', getAllKanbanBoardStats as RequestHandler);

/**
 * @openapi
 * /api/kanban/users/admins:
 *   get:
 *     tags:
 *       - Kanban
 *     summary: Récupère tous les utilisateurs admin
 *     responses:
 *       200:
 *         description: Liste des utilisateurs admin
 */
router.get('/users/admins', getAdminUsers as RequestHandler);

export default router;
