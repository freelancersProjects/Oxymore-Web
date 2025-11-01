import { Request, Response } from "express";
import * as UserSanctionService from "../../services/user/userSanctionService";
import { createAdminNotificationForAction } from "../../services/admin/notificationAdminService";
import * as UserService from "../../services/user/userService";
import { db } from "../../config/db";

export const getAllUserSanctions = async (req: Request, res: Response) => {
  const sanctions = await UserSanctionService.getAllUserSanctions();
  res.json(sanctions);
};

export const createUserSanction = async (req: Request, res: Response) => {
  const { reason, type, created_at, expires_at, id_user, id_admin } = req.body;
  if (!type || !id_user || !id_admin) {
    res.status(400).json({ message: "type, id_user et id_admin sont requis" });
    return;
  }
  const newSanction = await UserSanctionService.createUserSanction({
    reason,
    type,
    created_at,
    expires_at,
    id_user,
    id_admin
  });

  try {
    const user = await UserService.getUserById(id_user);
    const userName = user?.username || user?.name || `User ${id_user}`;
    const sanctionText = type === 'ban' ? 'banni' : type === 'mute' ? 'muté' : 'sanctionné';
    const details = reason 
      ? `${userName} a été ${sanctionText}. Raison: ${reason}` 
      : `${userName} a été ${sanctionText}`;
    
    await createAdminNotificationForAction(
      type === 'ban' ? 'ban' : type === 'mute' ? 'mute' : 'update',
      'Utilisateur',
      userName,
      details
    );
  } catch (error) {
    console.error('Error creating admin notification for sanction:', error);
  }

  res.status(201).json(newSanction);
};

export const deleteUserSanction = async (req: Request, res: Response) => {
  try {
    const [sanctions] = await db.query(
      "SELECT * FROM user_sanction WHERE id_user_sanction = ?",
      [req.params.id]
    ) as any[];
    
    const sanction = sanctions && sanctions.length > 0 ? sanctions[0] : null;

    await UserSanctionService.deleteUserSanction(req.params.id);

    if (sanction) {
      try {
        const user = await UserService.getUserById(sanction.id_user);
        const userName = user?.username || user?.first_name || `User ${sanction.id_user}`;
        const sanctionText = sanction.type === 'ban' ? 'ban' : sanction.type === 'mute' ? 'mute' : 'sanction';
        await createAdminNotificationForAction(
          'update',
          'Utilisateur',
          userName,
          `${sanctionText === 'ban' ? 'Ban' : sanctionText === 'mute' ? 'Mute' : 'Sanction'} de "${userName}" supprimé`
        );
      } catch (error) {
        console.error('Error creating admin notification for sanction deletion:', error);
      }
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user sanction:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
