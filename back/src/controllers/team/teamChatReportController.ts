import { Request, Response } from "express";
import * as TeamChatReportService from "../../services/team/teamChatReportService";

export const createTeamChatReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_team_chat, id_user, reason } = req.body;
    if (!id_team_chat || !id_user || !reason) {
      res.status(400).json({ message: "id_team_chat, id_user et reason sont requis" });
      return;
    }
    const report = await TeamChatReportService.createTeamChatReport({
      id_team_chat,
      id_user,
      reason
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeamChatReportsByMessageId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_team_chat } = req.params;
    const reports = await TeamChatReportService.getTeamChatReportsByMessageId(id_team_chat);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeamChatReportsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_user } = req.params;
    const reports = await TeamChatReportService.getTeamChatReportsByUserId(id_user);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

