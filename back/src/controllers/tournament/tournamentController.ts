import { Request, Response } from "express";
import * as TournamentService from "../../services/tournament/tournamentService";
import { createAdminNotificationForAction } from "../../services/admin/notificationAdminService";

export const getAllTournaments = async (req: Request, res: Response) => {
  const tournaments = await TournamentService.getAllTournaments();
  res.json(tournaments);
};

export const getTournamentById = async (req: Request, res: Response) => {
  try {
    const tournament = await TournamentService.getTournamentById(req.params.id);
    if (!tournament) {
      res.status(404).json({ message: "Tournoi non trouvé" });
      return;
    }
    res.json(tournament);
  } catch (error: any) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createTournament = async (req: Request, res: Response) => {
  try {
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
      cash_prize: cash_prize != null ? Number(cash_prize) : 0,
      entry_fee: entry_fee ? Number(entry_fee) : undefined,
      max_participant: max_participant ? Number(max_participant) : undefined,
      min_participant: min_participant ? Number(min_participant) : undefined,
      is_premium: Boolean(is_premium),
      image_url,
      id_league,
      id_badge_winner
    });

    await createAdminNotificationForAction(
      'create',
      'Tournoi',
      tournament_name,
      `Tournoi "${tournament_name}" créé avec succès`
    );

    res.status(201).json(newTournament);
  } catch (error: any) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateTournament = async (req: Request, res: Response) => {
  try {
    const {
      tournament_name, organized_by, description, type, format, structure, start_date, end_date, check_in_date, cash_prize, entry_fee, max_participant, min_participant, is_premium, image_url, id_league, id_badge_winner
    } = req.body;

    if (!tournament_name || !type || !format || !structure || !start_date || !end_date || !id_league) {
      res.status(400).json({ message: "tournament_name, type, format, structure, start_date, end_date, id_league sont requis" });
      return;
    }

    const tournament = await TournamentService.getTournamentById(req.params.id);
    const oldName = tournament?.tournament_name || 'Tournoi';

    const updatedTournament = await TournamentService.updateTournament(req.params.id, {
      tournament_name,
      organized_by,
      description,
      type,
      format,
      structure,
      start_date,
      end_date,
      check_in_date,
      cash_prize: cash_prize != null ? Number(cash_prize) : 0,
      entry_fee: entry_fee ? Number(entry_fee) : undefined,
      max_participant: max_participant ? Number(max_participant) : undefined,
      min_participant: min_participant ? Number(min_participant) : undefined,
      is_premium: Boolean(is_premium),
      image_url,
      id_league,
      id_badge_winner
    });

    if (!updatedTournament) {
      res.status(404).json({ message: "Tournoi non trouvé" });
      return;
    }

    await createAdminNotificationForAction(
      'update',
      'Tournoi',
      tournament_name || oldName,
      `Tournoi "${tournament_name || oldName}" modifié`
    );

    res.json(updatedTournament);
  } catch (error: any) {
    console.error('Error updating tournament:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteTournament = async (req: Request, res: Response) => {
  try {
    const tournament = await TournamentService.getTournamentById(req.params.id);
    const tournamentName = tournament?.tournament_name || 'Tournoi';

    const deleted = await TournamentService.deleteTournament(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Tournoi non trouvé" });
      return;
    }

    await createAdminNotificationForAction(
      'delete',
      'Tournoi',
      tournamentName,
      `Tournoi "${tournamentName}" supprimé`
    );

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getTournamentPageConfig = async (req: Request, res: Response) => {
  try {
    const config = await TournamentService.getTournamentPageConfig();
    res.json(config);
  } catch (error: any) {
    console.error('Error fetching tournament page config:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};