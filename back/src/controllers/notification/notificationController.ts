import { Request, Response } from "express";
import * as NotificationService from "../../services/notification/notificationService";

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await NotificationService.getAllNotifications();
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNotificationsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const notifications = await NotificationService.getNotificationsByUserId(userId);
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUnreadNotificationsCount = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const count = await NotificationService.getUnreadNotificationsCount(userId);
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { type, title, text } = req.body;

    if (!type || !title || !text) {
      res.status(400).json({ message: "Missing required fields: type, title, text" });
      return;
    }

    if (!['message', 'success', 'alert'].includes(type)) {
      res.status(400).json({ message: "Invalid notification type" });
      return;
    }

    const newNotification = await NotificationService.createNotification({
      type,
      title,
      text,
    });

    res.status(201).json(newNotification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const notificationId = parseInt(req.params.notificationId);

    if (isNaN(notificationId)) {
      res.status(400).json({ message: "Invalid notification ID" });
      return;
    }

    await NotificationService.markNotificationAsRead(userId, notificationId);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    await NotificationService.markAllNotificationsAsRead(userId);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notificationId = parseInt(req.params.notificationId);

    if (isNaN(notificationId)) {
      res.status(400).json({ message: "Invalid notification ID" });
      return;
    }

    await NotificationService.deleteNotification(notificationId);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNotificationForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const notificationId = parseInt(req.params.notificationId);
    if (!userId || isNaN(notificationId)) {
      res.status(400).json({ message: "Invalid userId or notificationId" });
      return;
    }
    await NotificationService.deleteNotificationForUser(userId, notificationId);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
