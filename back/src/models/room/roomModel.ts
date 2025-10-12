/**
 * @openapi
 * components:
 *   schemas:
 *     RoomInput:
 *       type: object
 *       required:
 *         - room_code
 *         - id_match
 *       properties:
 *         room_code:
 *           type: string
 *         map_picker_url:
 *           type: string
 *         is_pick_phase_active:
 *           type: boolean
 *         admin_joinable:
 *           type: boolean
 *         id_match:
 *           type: string
 */

import { Room } from '../../interfaces/room/roomInterfaces';

export { Room };
