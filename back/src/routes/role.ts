import express, { Request, Response } from 'express';
import { db } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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
 *   name: Roles
 *   description: Role management endpoints
 */

/**
 * @openapi
 * /api/roles/{userId}:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Get user role
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
 *                   type: string
 *                   example: "b0c2d1c3-4b5a-6d7e-8f9g-0h1i2j3k4l5m"
 *                 name:
 *                   type: string
 *                   example: "user"
 *       404:
 *         description: User not found
 */
router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const [roles] = await db.execute<Role[]>(
      'SELECT r.* FROM roles r INNER JOIN user u ON r.id = u.role_id WHERE u.id_user = ?',
      [req.params.userId]
    );

    if (!roles || roles.length === 0) {
      res.status(404).json({ message: "User role not found" });
      return;
    }

    res.json(roles[0]);
  } catch (error) {
    console.error("Error getting user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @openapi
 * /api/roles/{userId}:
 *   put:
 *     tags:
 *       - Roles
 *     summary: Update user role
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
 *               - role_id
 *             properties:
 *               role_id:
 *                 type: string
 *                 description: The UUID of the role to assign
 *                 example: "b0c2d1c3-4b5a-6d7e-8f9g-0h1i2j3k4l5m"
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

    // Vérifier si le rôle existe
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

    // Mettre à jour le rôle de l'utilisateur
    await db.execute<ResultSetHeader>(
      'UPDATE user SET role_id = ? WHERE id_user = ?',
      [role_id, req.params.userId]
    );

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router; 