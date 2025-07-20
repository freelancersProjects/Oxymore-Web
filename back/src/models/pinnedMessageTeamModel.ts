/**
 * @openapi
 * components:
 *   schemas:
 *     PinnedMessageTeamInput:
 *       type: object
 *       required:
 *         - pinned_at
 *         - id_team_chat
 *         - pinned_by
 *       properties:
 *         pinned_at:
 *           type: string
 *           format: date-time
 *         id_team_chat:
 *           type: string
 *         pinned_by:
 *           type: string
 */

export interface PinnedMessageTeam {
  id_pinned_message_team: string;
  pinned_at: string;
  id_team_chat: string;
  pinned_by: string;
}
