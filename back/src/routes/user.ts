import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
} from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);

export default router;
