import { Router } from "express";
import { getActiveUsersCount } from "../../controllers/stats/statsController";

const router = Router();

router.get("/active-users", getActiveUsersCount);

export default router;



