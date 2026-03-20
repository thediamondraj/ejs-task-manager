import express from "express";
import {
  showRegister,
  showLogin,
  register,
  login,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/register", showRegister);
router.post("/register", register);

router.get("/login", showLogin);
router.post("/login", login);

router.get("/logout", protect, logout);

export default router;