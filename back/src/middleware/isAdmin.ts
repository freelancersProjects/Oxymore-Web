import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
  id: string;
  role: string;
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Vérifier si l'utilisateur est connecté
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    // Extraire le token
    const token = req.headers.authorization.split(' ')[1];
    
    // Vérifier si l'utilisateur existe et est admin
    const [users] = await db.execute<User[]>(
      'SELECT users.* FROM users JOIN user_sessions ON users.id = user_sessions.userId WHERE user_sessions.token = ?',
      [token]
    );

    if (!users || users.length === 0) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
      return;
    }

    const user = users[0];
    if (user.role !== 'admin') {
      res.status(403).json({ message: "Forbidden - Admin access required" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 