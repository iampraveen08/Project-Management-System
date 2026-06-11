import express from "express";
import {
  createUser,
  deleteUser,
  listUsers,
  updateProfile,
  updateUser
} from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/profile").put(protect, updateProfile);
router.route("/").get(protect, adminOnly, listUsers).post(protect, adminOnly, createUser);
router.route("/:id").put(protect, adminOnly, updateUser).delete(protect, adminOnly, deleteUser);

export default router;
