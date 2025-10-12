import { Request, Response } from "express";
import * as TeamSubscriptionService from "../../services/teamSubscriptionService";

export const getAllTeamSubscriptions = async (req: Request, res: Response) => {
  const subs = await TeamSubscriptionService.getAllTeamSubscriptions();
  res.json(subs);
};

export const createTeamSubscription = async (req: Request, res: Response) => {
  const { start_date, end_date, active, id_team, purchased_by } = req.body;
  if (!start_date || !end_date || !id_team || !purchased_by) {
    res.status(400).json({ message: "start_date, end_date, id_team et purchased_by sont requis" });
    return;
  }
  const newSub = await TeamSubscriptionService.createTeamSubscription({
    start_date,
    end_date,
    active,
    id_team,
    purchased_by
  });
  res.status(201).json(newSub);
};

export const deleteTeamSubscription = async (req: Request, res: Response) => {
  await TeamSubscriptionService.deleteTeamSubscription(req.params.id);
  res.status(204).send();
};
