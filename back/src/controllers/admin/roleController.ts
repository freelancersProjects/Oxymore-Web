import { Request, Response } from "express";
import * as RoleService from "../../services/admin/roleService";
import { createAdminNotificationForAction } from "../../services/admin/notificationAdminService";
import * as UserService from "../../services/user/userService";
import { db } from "../../config/db";
import { RowDataPacket } from "mysql2";

/**
 * @openapi
 * tags:
 *   name: Admin - Roles
 *   description: Admin endpoints for role management
 */

/**
 * @openapi
 * /api/admin/users/{userId}/role:
 *   get:
 *     tags:
 *       - Admin - Roles
 *     summary: Get user role (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: User not found
 */
export const getUserRole = async (req: Request, res: Response) => {
  try {
    const role = await RoleService.getUserRole(req.params.userId);
    if (!role) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(role);
  } catch (error) {
    console.error("Error getting user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @openapi
 * /api/admin/users/{userId}/role:
 *   put:
 *     tags:
 *       - Admin - Roles
 *     summary: Update user role (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: integer
 *                 description: The ID of the role to assign
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 */
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.body;
    const updated = await RoleService.updateUserRole(req.params.userId, roleId);
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const user = await UserService.getUserById(req.params.userId);
      const userName = user?.username || user?.first_name || `User ${req.params.userId}`;
      
      interface Role extends RowDataPacket {
        id: number;
        name: string;
      }
      const [roles] = await db.execute<Role[]>('SELECT * FROM roles WHERE id = ?', [roleId]);
      const roleName = roles.length > 0 ? roles[0].name : 'nouveau rôle';

      await createAdminNotificationForAction(
        'update',
        'Utilisateur',
        userName,
        `Rôle de "${userName}" changé vers "${roleName}"`
      );
    } catch (error) {
      console.error('Error creating admin notification for role change:', error);
    }

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
