import express from "express";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
  updateProjectStatus
} from "../controllers/projectController.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { uploadProjectAttachments } from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(protect, listProjects)
  .post(protect, adminOnly, uploadProjectAttachments, createProject);

router
  .route("/:id")
  .get(protect, getProject)
  .put(protect, adminOnly, uploadProjectAttachments, updateProject)
  .delete(protect, adminOnly, deleteProject);

router.patch("/:id/status", protect, updateProjectStatus);

export default router;
