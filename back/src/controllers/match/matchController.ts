import { Request, Response } from "express";
import * as MatchService from "../../services/match/matchService";

export const getAllMatches = async (req: Request, res: Response) => {
  const matches = await MatchService.getAllMatches();
  res.json(matches);
};

export const createMatch = async (req: Request, res: Response) => {
  const { score_team1, score_team2, match_date, status, is_streamed, id_tournament, id_team1, id_team2, id_winner_team } = req.body;
  if (score_team1 === undefined || score_team2 === undefined || !match_date || !status || !id_tournament || !id_team1 || !id_team2) {
    res.status(400).json({ message: "score_team1, score_team2, match_date, status, id_tournament, id_team1, id_team2 sont requis" });
    return;
  }
  const newMatch = await MatchService.createMatch({
    score_team1,
    score_team2,
    match_date,
    status,
    is_streamed,
    id_tournament,
    id_team1,
    id_team2,
    id_winner_team
  });
  res.status(201).json(newMatch);
};

export const deleteMatch = async (req: Request, res: Response) => {
  await MatchService.deleteMatch(req.params.id);
  res.status(204).send();
};
