/**
 * @openapi
 * components:
 *   schemas:
 *     UserInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password_hash
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password_hash:
 *           type: string
 *         is_premium:
 *           type: boolean
 *         avatar_url:
 *           type: string
 *         banner_url:
 *           type: string
 *         bio:
 *           type: string
 *         elo:
 *           type: integer
 *         wallet:
 *           type: number
 *         country_code:
 *           type: string
 *         discord_link:
 *           type: string
 *         faceit_id:
 *           type: string
 *         steam_link:
 *           type: string
 *         twitch_link:
 *           type: string
 *         youtube_link:
 *           type: string
 *         verified:
 *           type: boolean
 *         team_chat_is_muted:
 *           type: boolean
 *         role_id:
 *           oneOf:
 *             - type: string
 *             - type: integer
 */

export interface User {
  id_user: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password_hash: string;
  is_premium: boolean;
  avatar_url: string;
  banner_url: string;
  bio: string;
  elo: number;
  wallet?: number | null;
  country_code: string;
  discord_link: string;
  faceit_id: string;
  steam_link: string;
  twitch_link: string;
  youtube_link: string;
  verified: boolean;
  created_at: string;
  team_chat_is_muted: boolean;
  role_id: string | number;
}
