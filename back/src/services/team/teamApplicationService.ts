import { TeamApplication, TeamApplicationData, CreateTeamApplicationInput, TeamApplicationWithUser } from '../../interfaces/team/teamApplicationInterfaces';
import { db } from '../../config/db';
import crypto from 'crypto';

export const createTeamApplication = async (data: CreateTeamApplicationInput): Promise<TeamApplicationData> => {
  const id_team_application = crypto.randomUUID();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await db.query(
    `INSERT INTO team_application
     (id_team_application, id_team, id_user, subject, message, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [
      id_team_application,
      data.id_team,
      data.id_user,
      data.subject || null,
      data.message || null,
      now,
      now
    ]
  );

  const [rows] = await db.query(
    'SELECT * FROM team_application WHERE id_team_application = ?',
    [id_team_application]
  );
  const applications = rows as TeamApplicationData[];
  return applications[0];
};

export const getTeamApplicationsByTeamId = async (id_team: string): Promise<TeamApplicationWithUser[]> => {
  const [rows] = await db.query(
    `SELECT
      ta.*,
      u.username,
      u.avatar_url,
      t.team_name
    FROM team_application ta
    LEFT JOIN user u ON ta.id_user = u.id_user
    LEFT JOIN team t ON ta.id_team = t.id_team
    WHERE ta.id_team = ?
    ORDER BY ta.created_at DESC`,
    [id_team]
  );
  return rows as TeamApplicationWithUser[];
};

export const getTeamApplicationsByUserId = async (id_user: string): Promise<TeamApplicationWithUser[]> => {
  const [rows] = await db.query(
    `SELECT
      ta.*,
      u.username,
      u.avatar_url,
      t.team_name
    FROM team_application ta
    LEFT JOIN user u ON ta.id_user = u.id_user
    LEFT JOIN team t ON ta.id_team = t.id_team
    WHERE ta.id_user = ?
    ORDER BY ta.created_at DESC`,
    [id_user]
  );
  return rows as TeamApplicationWithUser[];
};

export const getTeamApplicationById = async (id_team_application: string): Promise<TeamApplicationWithUser | null> => {
  const [rows] = await db.query(
    `SELECT
      ta.*,
      u.username,
      u.avatar_url,
      t.team_name
    FROM team_application ta
    LEFT JOIN user u ON ta.id_user = u.id_user
    LEFT JOIN team t ON ta.id_team = t.id_team
    WHERE ta.id_team_application = ?`,
    [id_team_application]
  );
  const applications = rows as TeamApplicationWithUser[];
  return applications.length > 0 ? applications[0] : null;
};

export const updateTeamApplicationStatus = async (
  id_team_application: string,
  status: 'pending' | 'accepted' | 'rejected'
): Promise<void> => {
  await db.query(
    'UPDATE team_application SET status = ?, updated_at = NOW() WHERE id_team_application = ?',
    [status, id_team_application]
  );
};

export const deleteTeamApplication = async (id_team_application: string): Promise<void> => {
  await db.query('DELETE FROM team_application WHERE id_team_application = ?', [id_team_application]);
};


