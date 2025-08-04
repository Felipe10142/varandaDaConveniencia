import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadAvatar,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/userController";
import { protect, restrictTo } from "../middleware/authMiddleware";

const router = express.Router();

// Rutas públicas
import { validate } from "../middleware/validationMiddleware";
import { registerSchema, loginSchema } from "../validations/userValidation";

router.post("/register", uploadAvatar, validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);
router.get("/verify/:token", verifyEmail);
router.post("/refresh-token", refreshToken);

// Rutas protegidas para usuarios autenticados
router.use(protect);

router.get("/profile", getUserProfile);
router.put("/profile", uploadAvatar, updateUserProfile);

// Rutas protegidas para administradores
router.use(restrictTo("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", uploadAvatar, updateUser);
router.delete("/:id", deleteUser);

export default router;
