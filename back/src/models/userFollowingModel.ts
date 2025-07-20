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

export interface UserFollowing {
  id_user_following: string;
  followed_at?: string;
  id_follower: string;
  id_followed: string;
}
