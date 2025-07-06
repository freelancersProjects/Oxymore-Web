/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id_user:
 *           type: string
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
 *         xp_total:
 *           type: integer
 *         wallet:
 *           type: number
 *         country_code:
 *           type: string
 *         discord_tag:
 *           type: string
 *         faceit_id:
 *           type: string
 *         verified:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
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
  xp_total: number;
  wallet?: number | null;
  country_code: string;
  discord_tag: string;
  faceit_id: string;
  verified: boolean;
  created_at: string;
}

export const users: User[] = [
  {
    id_user: "1",
    first_name: "Alice",
    last_name: "Doe",
    username: "alice",
    email: "alice@example.com",
    password_hash: "hashedpassword",
    is_premium: true,
    avatar_url: "https://example.com/avatar.png",
    banner_url: "https://example.com/banner.png",
    bio: "Gamer pro",
    elo: 1500,
    xp_total: 2500,
    wallet: 100.5,
    country_code: "FR",
    discord_tag: "Alice#1234",
    faceit_id: "FACEIT123",
    verified: true,
    created_at: new Date().toISOString(),
  },
];
