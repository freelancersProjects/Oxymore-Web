import { Request, Response } from "express";
import * as TournamentService from "../services/tournamentService";

export const getAllTournaments = async (req: Request, res: Response) => {
  const tournaments = await TournamentService.getAllTournaments();
  res.json(tournaments);
};

export const createTournament = async (req: Request, res: Response) => {
  const {
    tournament_name, organized_by, description, type, format, structure, start_date, end_date, check_in_date, cash_prize, entry_fee, max_participant, min_participant, is_premium, image_url, id_league, id_badge_winner
  } = req.body;
  if (!tournament_name || !type || !format || !structure || !start_date || !end_date || !id_league) {
    res.status(400).json({ message: "tournament_name, type, format, structure, start_date, end_date, id_league sont requis" });
    return;
  }
  const newTournament = await TournamentService.createTournament({
    tournament_name,
    organized_by,
    description,
    type,
    format,
    structure,
    start_date,
    end_date,
    check_in_date,
    cash_prize,
    entry_fee,
    max_participant,
    min_participant,
    is_premium,
    image_url,
    id_league,
    id_badge_winner
  });
  res.status(201).json(newTournament);
};

export const deleteTournament = async (req: Request, res: Response) => {
  await TournamentService.deleteTournament(req.params.id);
  res.status(204).send();
};
