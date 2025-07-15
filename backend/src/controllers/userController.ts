import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { generateToken } from '../utils/generateToken';
import { Email } from '../utils/email';
import AppError from '../utils/appError';
import crypto from 'crypto';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import sharp from 'sharp';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Registrar un nuevo usuario
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('El usuario ya existe', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: 'default-avatar.png'
  });

  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token
    }
  });
});

// @desc    Autenticar usuario y obtener token
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email y contraseña son obligatorios', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Email o contraseña incorrectos', 401);
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token
    }
  });
});

// @desc    Cerrar sesión de usuario
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ status: 'success' });
});

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Obtener estadísticas de pedidos
  const orderStats = await Order.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      user,
      stats: orderStats[0] || { totalOrders: 0, totalSpent: 0 }
    }
  });
});

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Actualizar avatar si se proporciona
  if (req.file) {
    // Eliminar avatar anterior si no es el default
    if (user.avatar && !user.avatar.includes('default-avatar')) {
      await deleteFromCloudinary(user.avatar);
    }

    const buffer = await sharp(req.file.buffer)
      .resize(200, 200)
      .jpeg({ quality: 90 })
      .toBuffer();

    const result = await uploadToCloudinary(buffer);
    req.body.avatar = result.secure_url;
  }

  // Actualizar campos
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }
  if (req.body.avatar) {
    user.avatar = req.body.avatar;
  }
  if (req.body.address) {
    user.address = req.body.address;
  }
  if (req.body.phoneNumber) {
    user.phoneNumber = req.body.phoneNumber;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      address: updatedUser.address,
      phoneNumber: updatedUser.phoneNumber
    }
  });
});

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await User.countDocuments();
  const pages = Math.ceil(total / limit);

  res.status(200).json({
    status: 'success',
    results: users.length,
    pagination: {
      current: page,
      pages,
      total
    },
    data: users
  });
});

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  res.status(200).json({
    status: 'success',
    data: user
  });
});

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Procesar avatar si se proporciona
  if (req.file) {
    if (user.avatar && !user.avatar.includes('default-avatar')) {
      await deleteFromCloudinary(user.avatar);
    }

    const buffer = await sharp(req.file.buffer)
      .resize(200, 200)
      .jpeg({ quality: 90 })
      .toBuffer();

    const result = await uploadToCloudinary(buffer);
    req.body.avatar = result.secure_url;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedUser
  });
});

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Eliminar avatar si no es el default
  if (user.avatar && !user.avatar.includes('default-avatar')) {
    await deleteFromCloudinary(user.avatar);
  }

  await User.findByIdAndDelete(user._id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Enviar email de recuperación de contraseña
// @route   POST /api/users/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new AppError('No hay usuario con ese email', 404);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token enviado al email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError('Hubo un error enviando el email. Intente más tarde.', 500);
  }
});

// @desc    Restablecer contraseña
// @route   PUT /api/users/resetpassword/:token
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Token inválido o expirado', 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    }
  });
});

// @desc    Verificar email
// @route   GET /api/users/verify/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Token inválido o expirado', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Email verificado exitosamente'
  });
});

// Middleware para procesar avatar
export const uploadAvatar = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user?._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});
