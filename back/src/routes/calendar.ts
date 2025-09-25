import express, { Request, Response } from 'express';
import * as calendarController from '../controllers/calendarController';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Calendar
 *   description: Calendar events management endpoints
 */

/**
 * @openapi
 * /api/calendar:
 *   post:
 *     tags:
 *       - Calendar
 *     summary: Create a new calendar event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - start_time
 *               - end_time
 *               - calendar_type
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Réunion équipe"
 *               description:
 *                 type: string
 *                 example: "Discussion sur les prochains objectifs"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "09:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "10:30"
 *               location:
 *                 type: string
 *                 example: "Salle de réunion A"
 *               calendar_type:
 *                 type: string
 *                 enum: [meeting, tournament, training, other, league]
 *                 example: "meeting"
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1", "user2", "user3"]
 *               color:
 *                 type: string
 *                 example: "#6366f1"
 *               is_completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Calendar event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "b0c2d1c3-4b5a-6d7e-8f9g-0h1i2j3k4l5m"
 *                 title:
 *                   type: string
 *                   example: "Réunion équipe"
 *                 description:
 *                   type: string
 *                   example: "Discussion sur les prochains objectifs"
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-01-15"
 *                 start_time:
 *                   type: string
 *                   example: "09:00"
 *                 end_time:
 *                   type: string
 *                   example: "10:30"
 *                 location:
 *                   type: string
 *                   example: "Salle de réunion A"
 *                 calendar_type:
 *                   type: string
 *                   example: "meeting"
 *                 attendees:
 *                   type: array
 *                   items:
 *                     type: string
 *                 color:
 *                   type: string
 *                   example: "#6366f1"
 *                 is_completed:
 *                   type: boolean
 *                   example: false
 *                 created_by:
 *                   type: string
 *                   example: "user123"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', calendarController.createCalendarEvent);

/**
 * @openapi
 * /api/calendar:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Get all calendar events
 *     responses:
 *       200:
 *         description: Calendar events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   start_time:
 *                     type: string
 *                   end_time:
 *                     type: string
 *                   location:
 *                     type: string
 *                   calendar_type:
 *                     type: string
 *                   attendees:
 *                     type: array
 *                     items:
 *                       type: string
 *                   color:
 *                     type: string
 *                   is_completed:
 *                     type: boolean
 *                   created_by:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/', calendarController.getAllCalendarEvents);

/**
 * @openapi
 * /api/calendar/range:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Get calendar events by date range
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Calendar events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   start_time:
 *                     type: string
 *                   end_time:
 *                     type: string
 *                   calendar_type:
 *                     type: string
 *                   is_completed:
 *                     type: boolean
 *       400:
 *         description: Bad request - missing date parameters
 *       500:
 *         description: Internal server error
 */
router.get('/range', calendarController.getCalendarEventsByDateRange);

/**
 * @openapi
 * /api/calendar/type/{type}:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Get calendar events by type
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [meeting, tournament, training, other, league]
 *           example: "meeting"
 *     responses:
 *       200:
 *         description: Calendar events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   calendar_type:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get('/type/:type', calendarController.getCalendarEventsByType);

/**
 * @openapi
 * /api/calendar/stats:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Get calendar statistics
 *     responses:
 *       200:
 *         description: Calendar statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_events:
 *                   type: number
 *                   example: 25
 *                 completed_events:
 *                   type: number
 *                   example: 15
 *                 upcoming_events:
 *                   type: number
 *                   example: 10
 *                 events_by_type:
 *                   type: object
 *                   properties:
 *                     meeting:
 *                       type: number
 *                       example: 8
 *                     tournament:
 *                       type: number
 *                       example: 5
 *                     training:
 *                       type: number
 *                       example: 7
 *                     other:
 *                       type: number
 *                       example: 3
 *                     league:
 *                       type: number
 *                       example: 2
 *       500:
 *         description: Internal server error
 */
router.get('/stats', calendarController.getCalendarStats);

/**
 * @openapi
 * /api/calendar/{id}:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Get a specific calendar event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b0c2d1c3-4b5a-6d7e-8f9g-0h1i2j3k4l5m"
 *     responses:
 *       200:
 *         description: Calendar event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 start_time:
 *                   type: string
 *                 end_time:
 *                   type: string
 *                 location:
 *                   type: string
 *                 calendar_type:
 *                   type: string
 *                 attendees:
 *                   type: array
 *                   items:
 *                     type: string
 *                 color:
 *                   type: string
 *                 is_completed:
 *                   type: boolean
 *                 created_by:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Calendar event not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', calendarController.getCalendarEventById);

/**
 * @openapi
 * /api/calendar/{id}:
 *   put:
 *     tags:
 *       - Calendar
 *     summary: Update a calendar event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b0c2d1c3-4b5a-6d7e-8f9g-0h1i2j3k4l5m"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Réunion équipe mise à jour"
 *               description:
 *                 type: string
 *                 example: "Discussion sur les nouveaux objectifs"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-16"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "10:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "11:30"
 *               location:
 *                 type: string
 *                 example: "Salle de réunion B"
 *               calendar_type:
 *                 type: string
 *                 enum: [meeting, tournament, training, other, league]
 *                 example: "meeting"
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: string
 *               color:
 *                 type: string
 *                 example: "#8b5cf6"
 *               is_completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Calendar event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 start_time:
 *                   type: string
 *                 end_time:
 *                   type: string
 *                 location:
 *                   type: string
 *                 calendar_type:
 *                   type: string
 *                 attendees:
 *                   type: array
 *                   items:
 *                     type: string
 *                 color:
 *                   type: string
 *                 is_completed:
 *                   type: boolean
 *                 created_by:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Calendar event not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', calendarController.updateCalendarEvent);

/**
 * @openapi
 * /api/calendar/{id}:
 *   delete:
 *     tags:
 *       - Calendar
 *     summary: Delete a calendar event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b0c2d1c3-4b5a-6d7e-8f9g-0h1i2j3k4l5m"
 *     responses:
 *       200:
 *         description: Calendar event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Événement calendrier supprimé avec succès"
 *       404:
 *         description: Calendar event not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', calendarController.deleteCalendarEvent);

export default router;
