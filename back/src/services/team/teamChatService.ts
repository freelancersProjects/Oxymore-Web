import { TeamChat, TeamChatData } from "../../interfaces/team/teamInterfaces";
import { db } from "../../config/db";
import crypto from "crypto";
import * as NotificationService from "../notification/notificationService";

export const getAllTeamChats = async (): Promise<TeamChat[]> => {
  const [rows] = await db.query("SELECT * FROM team_chat");
  return rows as TeamChat[];
};

export const createTeamChat = async (data: any): Promise<TeamChatData> => {
  const id_team_chat = crypto.randomUUID();

  try {
    await db.query(
      "INSERT INTO team_chat (id_team_chat, message, sent_at, id_team, id_user, is_admin, reply_to) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id_team_chat,
        data.message,
        data.sent_at ?? new Date().toISOString(),
        data.id_team,
        data.id_user || null,
        data.is_admin ? 1 : 0,
        data.reply_to || null
      ]
    );
  } catch (error: any) {
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      if (error.sqlMessage?.includes('reply_to')) {
        try {
          await db.query(
            "INSERT INTO team_chat (id_team_chat, message, sent_at, id_team, id_user, is_admin) VALUES (?, ?, ?, ?, ?, ?)",
            [
              id_team_chat,
              data.message,
              data.sent_at ?? new Date().toISOString(),
              data.id_team,
              data.id_user || null,
              data.is_admin ? 1 : 0
            ]
          );
        } catch (innerError: any) {
          if (innerError.code === 'ER_BAD_FIELD_ERROR' && innerError.sqlMessage?.includes('is_admin')) {
            await db.query(
              "INSERT INTO team_chat (id_team_chat, message, sent_at, id_team, id_user) VALUES (?, ?, ?, ?, ?)",
              [
                id_team_chat,
                data.message,
                data.sent_at ?? new Date().toISOString(),
                data.id_team,
                data.id_user || null
              ]
            );
          } else {
            throw innerError;
          }
        }
      } else if (error.sqlMessage?.includes('is_admin')) {
        await db.query(
          "INSERT INTO team_chat (id_team_chat, message, sent_at, id_team, id_user) VALUES (?, ?, ?, ?, ?)",
          [
            id_team_chat,
            data.message,
            data.sent_at ?? new Date().toISOString(),
            data.id_team,
            data.id_user || null
          ]
        );
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }

  if (data.reply_to && data.id_user) {
    try {
      const [replyRows] = await db.query(
        "SELECT id_user, message FROM team_chat WHERE id_team_chat = ?",
        [data.reply_to]
      );
      const replyMessage = replyRows as any[];
      
      if (replyMessage.length > 0 && replyMessage[0].id_user && replyMessage[0].id_user !== data.id_user) {
        const [userRows] = await db.query(
          "SELECT username FROM user WHERE id_user = ?",
          [data.id_user]
        );
        const user = userRows as any[];
        const replyerUsername = user.length > 0 ? user[0].username : "Quelqu'un";
        
        const [teamRows] = await db.query(
          "SELECT team_name FROM team WHERE id_team = ?",
          [data.id_team]
        );
        const team = teamRows as any[];
        const teamName = team.length > 0 ? team[0].team_name : "l'équipe";
        
        await NotificationService.createNotification({
          type: 'message',
          title: 'Nouvelle réponse',
          text: `${replyerUsername} a répondu à votre message dans ${teamName}`,
          id_user: replyMessage[0].id_user
        });
      }
    } catch (error) {
    }
  }

  return {
    id_team_chat,
    ...data
  };
};

export const deleteTeamChat = async (id_team_chat: string): Promise<void> => {
  await db.query("DELETE FROM team_chat WHERE id_team_chat = ?", [id_team_chat]);
};

export const getTeamChatsByTeamId = async (id_team: string): Promise<any[]> => {
  try {
    const [rows] = await db.query(
      `SELECT
        tc.id_team_chat,
        tc.message,
        tc.sent_at,
        tc.id_team,
        tc.id_user,
        COALESCE(tc.is_admin, 0) as is_admin,
        tc.reply_to,
        u.username,
        u.avatar_url,
        reply_msg.message as reply_message,
        reply_msg.id_user as reply_id_user,
        COALESCE(reply_user.username, CASE WHEN reply_msg.id_user IS NULL OR reply_msg.is_admin = 1 THEN 'Admin' ELSE NULL END) as reply_username
      FROM team_chat tc
      LEFT JOIN user u ON tc.id_user = u.id_user
      LEFT JOIN team_chat reply_msg ON tc.reply_to = reply_msg.id_team_chat
      LEFT JOIN user reply_user ON reply_msg.id_user = reply_user.id_user AND reply_msg.id_user IS NOT NULL
      WHERE tc.id_team = ?
      ORDER BY tc.sent_at ASC`,
      [id_team]
    );
    return rows as any[];
  } catch (error: any) {
    if (error.code === 'ER_BAD_FIELD_ERROR' && error.sqlMessage?.includes('is_admin')) {
      const [rows] = await db.query(
        `SELECT
          tc.id_team_chat,
          tc.message,
          tc.sent_at,
          tc.id_team,
          tc.id_user,
          0 as is_admin,
          tc.reply_to,
          u.username,
          u.avatar_url,
          reply_msg.message as reply_message,
          reply_msg.id_user as reply_id_user,
          COALESCE(reply_user.username, CASE WHEN reply_msg.id_user IS NULL OR reply_msg.is_admin = 1 THEN 'Admin' ELSE NULL END) as reply_username
        FROM team_chat tc
        LEFT JOIN user u ON tc.id_user = u.id_user
        LEFT JOIN team_chat reply_msg ON tc.reply_to = reply_msg.id_team_chat
        LEFT JOIN user reply_user ON reply_msg.id_user = reply_user.id_user AND reply_msg.id_user IS NOT NULL
        WHERE tc.id_team = ?
        ORDER BY tc.sent_at ASC`,
        [id_team]
      );
      return rows as any[];
    }
    throw error;
  }
};

export const deleteTeamChatById = async (id_team_chat: string): Promise<void> => {
  await db.query("DELETE FROM team_chat WHERE id_team_chat = ?", [id_team_chat]);
};

export const updateTeamChatById = async (id_team_chat: string, message: string): Promise<void> => {
  await db.query("UPDATE team_chat SET message = ? WHERE id_team_chat = ?", [message, id_team_chat]);
};

