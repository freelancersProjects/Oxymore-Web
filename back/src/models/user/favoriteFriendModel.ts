/**
 * @openapi
 * components:
 *   schemas:
 *     FavoriteFriendInput:
 *       type: object
 *       required:
 *         - id_user
 *         - id_friend
 *       properties:
 *         id_user:
 *           type: string
 *         id_friend:
 *           type: string
 *     FavoriteFriend:
 *       type: object
 *       properties:
 *         id_favorite_friend:
 *           type: string
 *         id_user:
 *           type: string
 *         id_friend:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

import { FavoriteFriend, FavoriteFriendData } from '../../interfaces/user/favoriteFriendInterfaces';

export { FavoriteFriend, FavoriteFriendData };






