import { Request, Response } from "express";
import * as NotificationAdminService from "../../services/admin/notificationAdminService";
import { NotificationAdminInput } from "../../interfaces/admin/notificationAdminInterfaces";

export const getAllNotificationAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await NotificationAdminService.getAllNotificationAdmins();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error getting notification admins:", error);
    res.status(500).json({ message: "Error getting notification admins" });
  }
};

export const getUnreadNotificationAdminsCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await NotificationAdminService.getUnreadNotificationAdminsCount();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error getting unread notification admins count:", error);
    res.status(500).json({ message: "Error getting unread notification admins count" });
  }
};

export const createNotificationAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, title, text }: NotificationAdminInput = req.body;

    if (!type || !title || !text) {
      res.status(400).json({ message: "Missing required fields: type, title, text" });
      return;
    }

    if (!["message", "success", "alert"].includes(type)) {
      res.status(400).json({ message: "Invalid notification type" });
      return;
    }

    const notification = await NotificationAdminService.createNotificationAdmin({
      type,
      title,
      text,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification admin:", error);
    res.status(500).json({ message: "Error creating notification admin" });
  }
};

export const markNotificationAdminAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      res.status(400).json({ message: "Missing notificationId" });
      return;
    }

    await NotificationAdminService.markNotificationAdminAsRead(notificationId);
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification admin as read:", error);
    res.status(500).json({ message: "Error marking notification admin as read" });
  }
};

export const markAllNotificationAdminsAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await NotificationAdminService.markAllNotificationAdminsAsRead();
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notification admins as read:", error);
    res.status(500).json({ message: "Error marking all notification admins as read" });
  }
};

export const deleteNotificationAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      res.status(400).json({ message: "Missing notificationId" });
      return;
    }

    await NotificationAdminService.deleteNotificationAdmin(notificationId);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification admin:", error);
    res.status(500).json({ message: "Error deleting notification admin" });
  }
};

export const getNotificationAdminById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      res.status(400).json({ message: "Missing notificationId" });
      return;
    }

    const notification = await NotificationAdminService.getNotificationAdminById(notificationId);

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error getting notification admin:", error);
    res.status(500).json({ message: "Error getting notification admin" });
  }
};

