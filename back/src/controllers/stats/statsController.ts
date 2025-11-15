import { Request, Response } from "express";
import { connectionStore } from "../../websocket/store/connectionStore";

export const getActiveUsersCount = async (req: Request, res: Response) => {
  try {
    const activeUsersCount = connectionStore.getUniqueUsersCount();
    res.json({ activeUsers: activeUsersCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};



