/**
 * @openapi
 * components:
 *   schemas:
 *     UserFollowingInput:
 *       type: object
 *       required:
 *         - id_follower
 *         - id_followed
 *       properties:
 *         followed_at:
 *           type: string
 *           format: date-time
 *         id_follower:
 *           type: string
 *         id_followed:
 *           type: string
 */

import { UserFollowing } from '../../interfaces/user/userInterfaces';

export { UserFollowing };
