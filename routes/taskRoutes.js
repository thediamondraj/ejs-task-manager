import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTasks,
  createTask,
  editTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/dashboard", protect, getTasks);
router.post("/tasks", protect, createTask);
router.post("/tasks/:id/edit", protect, editTask);
router.post("/tasks/:id/delete", protect, deleteTask);

export default router;