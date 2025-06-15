import { User, users } from "../models/userModel";
import { db } from "../config/db";

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await db.query("SELECT * FROM user");
  return rows as User[];
};

export const getUserById = (id: string): User | undefined => {
  return users.find((u) => u.id_user === id);
};

export const createUser = (
  data: Omit<User, "id_user" | "created_at">
): User => {
  const newUser: User = {
    id_user: crypto.randomUUID(),
    ...data,
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};
