import { TeamChallenge, TeamChallengeData, CreateTeamChallengeInput, TeamChallengeWithTeamInfo } from '../../interfaces/team/teamChallengeInterfaces';
import { db } from '../../config/db';
import crypto from 'crypto';

export const createTeamChallenge = async (data: CreateTeamChallengeInput): Promise<TeamChallengeData> => {
  const id_team_challenge = crypto.randomUUID();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (data.id_team_challenger === data.id_team_challenged) {
    throw new Error('Une équipe ne peut pas défier elle-même');
  }

  const [existingChallenge] = await db.query(
    `SELECT * FROM team_challenge
     WHERE ((id_team_challenger = ? AND id_team_challenged = ?)
        OR (id_team_challenger = ? AND id_team_challenged = ?))
     AND status IN ('pending', 'accepted')`,
    [data.id_team_challenger, data.id_team_challenged, data.id_team_challenged, data.id_team_challenger]
  );

  if (Array.isArray(existingChallenge) && existingChallenge.length > 0) {
    throw new Error('Un défi est déjà en cours entre ces deux équipes');
  }

  await db.query(
    `INSERT INTO team_challenge
     (id_team_challenge, id_team_challenger, id_team_challenged, status, scheduled_date, created_at, updated_at)
     VALUES (?, ?, ?, 'pending', ?, ?, ?)`,
    [
      id_team_challenge,
      data.id_team_challenger,
      data.id_team_challenged,
      data.scheduled_date || null,
      now,
      now
    ]
  );

  const [rows] = await db.query(
    'SELECT * FROM team_challenge WHERE id_team_challenge = ?',
    [id_team_challenge]
  );
  const challenges = rows as TeamChallengeData[];
  return challenges[0];
};

export const getTeamChallengesByTeamId = async (teamId: string): Promise<TeamChallengeWithTeamInfo[]> => {
  const [rows] = await db.query(
    `SELECT
      tc.*,
      t1.team_name as challenger_team_name,
      t1.team_logo_url as challenger_team_logo,
      t2.team_name as challenged_team_name,
      t2.team_logo_url as challenged_team_logo
    FROM team_challenge tc
    LEFT JOIN team t1 ON tc.id_team_challenger = t1.id_team
    LEFT JOIN team t2 ON tc.id_team_challenged = t2.id_team
    WHERE tc.id_team_challenger = ? OR tc.id_team_challenged = ?
    ORDER BY tc.created_at DESC`,
    [teamId, teamId]
  );
  return rows as TeamChallengeWithTeamInfo[];
};

export const getTeamChallengeById = async (id: string): Promise<TeamChallengeWithTeamInfo | null> => {
  const [rows] = await db.query(
    `SELECT
      tc.*,
      t1.team_name as challenger_team_name,
      t1.team_logo_url as challenger_team_logo,
      t2.team_name as challenged_team_name,
      t2.team_logo_url as challenged_team_logo
    FROM team_challenge tc
    LEFT JOIN team t1 ON tc.id_team_challenger = t1.id_team
    LEFT JOIN team t2 ON tc.id_team_challenged = t2.id_team
    WHERE tc.id_team_challenge = ?`,
    [id]
  );
  const challenges = rows as TeamChallengeWithTeamInfo[];
  return challenges.length > 0 ? challenges[0] : null;
};

export const updateTeamChallengeStatus = async (
  id: string,
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
): Promise<void> => {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await db.query(
    'UPDATE team_challenge SET status = ?, updated_at = ? WHERE id_team_challenge = ?',
    [status, now, id]
  );
};

export const updateTeamChallengeScheduledDate = async (
  id: string,
  scheduled_date: string | null
): Promise<void> => {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await db.query(
    'UPDATE team_challenge SET scheduled_date = ?, updated_at = ? WHERE id_team_challenge = ?',
    [scheduled_date, now, id]
  );
};

export const deleteTeamChallenge = async (id: string): Promise<void> => {
  await db.query('DELETE FROM team_challenge WHERE id_team_challenge = ?', [id]);
};


