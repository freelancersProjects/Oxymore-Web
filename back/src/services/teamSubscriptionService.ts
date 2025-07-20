import { TeamSubscription } from "../models/teamSubscriptionModel";
import { db } from "../config/db";
import crypto from "crypto";

export const getAllTeamSubscriptions = async (): Promise<TeamSubscription[]> => {
  const [rows] = await db.query("SELECT * FROM team_subscription");
  return rows as TeamSubscription[];
};

export const createTeamSubscription = async (data: Omit<TeamSubscription, "id_team_subscription">): Promise<TeamSubscription> => {
  const id_team_subscription = crypto.randomUUID();
  await db.query(
    "INSERT INTO team_subscription (id_team_subscription, start_date, end_date, active, id_team, purchased_by) VALUES (?, ?, ?, ?, ?, ?)",
    [
      id_team_subscription,
      data.start_date,
      data.end_date,
      data.active ?? true,
      data.id_team,
      data.purchased_by
    ]
  );
  return { id_team_subscription, ...data };
};

export const deleteTeamSubscription = async (id_team_subscription: string): Promise<void> => {
  await db.query("DELETE FROM team_subscription WHERE id_team_subscription = ?", [id_team_subscription]);
};
