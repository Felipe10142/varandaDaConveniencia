import express from 'express';
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
} from '../controllers/userController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// Rutas públicas
router.post('/register', uploadAvatar, registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.get('/verify/:token', verifyEmail);

// Rutas protegidas para usuarios autenticados
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', uploadAvatar, updateUserProfile);

// Rutas protegidas para administradores
router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', uploadAvatar, updateUser);
router.delete('/:id', deleteUser);

export default router;
