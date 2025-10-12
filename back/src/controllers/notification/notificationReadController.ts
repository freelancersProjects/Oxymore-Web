import { Request, Response } from "express";
import * as NotificationReadService from "../../services/notificationReadService";

export const getAllNotificationReads = async (req: Request, res: Response) => {
  const reads = await NotificationReadService.getAllNotificationReads();
  res.json(reads);
};

export const createNotificationRead = async (req: Request, res: Response) => {
  const { id_notification, id_user, read_at } = req.body;
  if (!id_notification || !id_user) {
    res.status(400).json({ message: "id_notification et id_user sont requis" });
    return;
  }
  const newRead = await NotificationReadService.createNotificationRead({
    id_notification,
    id_user,
    read_at
  });
  res.status(201).json(newRead);
};

export const deleteNotificationRead = async (req: Request, res: Response) => {
  await NotificationReadService.deleteNotificationRead(req.params.id);
  res.status(204).send();
};
