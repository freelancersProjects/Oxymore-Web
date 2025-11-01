import express, { Request, Response } from 'express';
import { db } from '../../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { createAdminNotificationForAction } from '../../services/admin/notificationAdminService';
import * as UserService from '../../services/user/userService';

const router = express.Router();

interface Role extends RowDataPacket {
  id: string;  // UUID
  name: string;
  description?: string;
}

interface User extends RowDataPacket {
  id_user: string;
  role_id: string;
}

interface UpdateRoleRequest {
  role_id: string;
}

/**
 * @openapi
 * tags:
 *   name: Admin - Roles
 *   description: Admin endpoints for role management
 */

/**
 * @openapi
 * /api/admin/roles/{userId}:
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
 *         example: "8c492d1e-6a0f-4230-8401-fcce1f39b092"
 *     responses:
 *       200:
 *         description: User role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6"
 *                 name:
 *                   type: string
 *                   example: "admin"
 *       404:
 *         description: User not found
 */
router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const [users] = await db.execute<User[]>(
      'SELECT r.* FROM roles r INNER JOIN user u ON r.id = u.role_id WHERE u.id_user = ?',
      [req.params.userId]
    );

    if (!users || users.length === 0) {
      res.status(404).json({ message: "User role not found" });
      return;
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Error getting user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @openapi
 * /api/admin/roles/{userId}:
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
 *         example: "8c492d1e-6a0f-4230-8401-fcce1f39b092"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *             properties:
 *               role_id:
 *                 type: string
 *                 description: The UUID of the role to assign
 *                 example: "a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6"
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
 *                   example: "User role updated successfully"
 *       404:
 *         description: User or role not found
 */
router.put('/:userId', async (req: Request<{ userId: string }, any, UpdateRoleRequest>, res: Response): Promise<void> => {
  try {
    const { role_id } = req.body;

    if (!role_id) {
      res.status(400).json({ message: "role_id is required" });
      return;
    }

    const [roles] = await db.execute<Role[]>(
      'SELECT * FROM roles WHERE id = ?',
      [role_id]
    );

    if (!roles || roles.length === 0) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    // Vérifier si l'utilisateur existe
    const [users] = await db.execute<User[]>(
      'SELECT * FROM user WHERE id_user = ?',
      [req.params.userId]
    );

    if (!users || users.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await db.execute<ResultSetHeader>(
      'UPDATE user SET role_id = ? WHERE id_user = ?',
      [role_id, req.params.userId]
    );

    try {
      const user = await UserService.getUserById(req.params.userId);
      const userName = user?.username || user?.first_name || `User ${req.params.userId}`;
      const roleName = roles[0]?.name || 'nouveau rôle';
      await createAdminNotificationForAction(
        'update',
        'Utilisateur',
        userName,
        `Rôle de "${userName}" changé vers "${roleName}"`
      );
    } catch (error) {
      console.error('Error creating admin notification for role change:', error);
    }

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @openapi
 * /api/admin/roles:
 *   get:
 *     tags:
 *       - Admin - Roles
 *     summary: Get all roles (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6"
 *                   name:
 *                     type: string
 *                     example: "admin"
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute<Role[]>('SELECT * FROM roles');
    res.json(rows);
  } catch (error) {
    console.error("Error getting roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router; 