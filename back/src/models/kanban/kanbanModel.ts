/**
 * @openapi
 * components:
 *   schemas:
 *     KanbanBoardInput:
 *       type: object
 *       required:
 *         - name
 *         - color
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         color:
 *           type: string
 *         is_default:
 *           type: boolean
 *         created_by:
 *           type: string
 *     KanbanTicketInput:
 *       type: object
 *       required:
 *         - title
 *         - id_kanban_board
 *         - status
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         id_kanban_board:
 *           type: string
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done]
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         assigned_to:
 *           type: string
 *         due_date:
 *           type: string
 *           format: date-time
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     KanbanTicketUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done]
 *         priority:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         assigned_to:
 *           type: string
 *         due_date:
 *           type: string
 *           format: date-time
 *         tags:
 *           type: array
 *           items:
 *             type: string
 */

import { KanbanBoard, KanbanTicket } from '../../interfaces/kanban/kanbanInterfaces';

export { KanbanBoard, KanbanTicket };


