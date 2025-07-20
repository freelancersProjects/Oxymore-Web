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
 *         created_at:
 *           type: string
 *           format: date-time
 *         team_chat_is_muted:
 *           type: boolean
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
    wallet: 100.5,
    country_code: "FR",
    discord_link: "Alice#1234",
    faceit_id: "FACEIT123",
    steam_link: "STEAM123",
    twitch_link: "twitch.tv/alice",
    youtube_link: "youtube.com/alice",
    verified: true,
    created_at: new Date().toISOString(),
    team_chat_is_muted: false,
  },
];
