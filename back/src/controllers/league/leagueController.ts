import { Request, Response } from "express";
import * as LeagueService from "../../services/league/leagueService";

export const getAllLeagues = async (req: Request, res: Response) => {
  const leagues = await LeagueService.getAllLeagues();
  res.json(leagues);
};

export const createLeague = async (req: Request, res: Response) => {
  const { league_name, max_teams, start_date, end_date, promotion_slots, relegation_slots, image_url, entry_type, id_badge_champion } = req.body;
  if (!league_name) {
    res.status(400).json({ message: "league_name est requis" });
    return;
  }
  const newLeague = await LeagueService.createLeague({
    league_name,
    max_teams,
    start_date,
    end_date,
    promotion_slots,
    relegation_slots,
    image_url,
    entry_type,
    id_badge_champion
  });
  res.status(201).json(newLeague);
};

export const getLeagueById = async (req: Request, res: Response) => {
  const league = await LeagueService.getLeagueById(req.params.id);
  if (!league) {
    res.status(404).json({ message: "League non trouvée" });
    return;
  }
  res.json(league);
};

export const updateLeague = async (req: Request, res: Response) => {
  const { league_name, max_teams, start_date, end_date, promotion_slots, relegation_slots, image_url, entry_type, id_badge_champion } = req.body;

  const updatedLeague = await LeagueService.updateLeague(req.params.id, {
    league_name,
    max_teams,
    start_date,
    end_date,
    promotion_slots,
    relegation_slots,
    image_url,
    entry_type,
    id_badge_champion
  });

  if (!updatedLeague) {
    res.status(404).json({ message: "League non trouvée" });
    return;
  }

  res.json(updatedLeague);
};

export const deleteLeague = async (req: Request, res: Response) => {
  await LeagueService.deleteLeague(req.params.id);
  res.status(204).send();
};
