import { Router } from "express";
import {
  createTeamChatReport,
  getTeamChatReportsByMessageId,
  getTeamChatReportsByUserId,
} from "../../controllers/team/teamChatReportController";

const router = Router();

router.post("/", createTeamChatReport);
router.get("/message/:id_team_chat", getTeamChatReportsByMessageId);
router.get("/user/:id_user", getTeamChatReportsByUserId);

export default router;

