import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { User, IUser } from '../models/User';
import AppError from '../utils/appError';

export interface AuthRequest extends Request {
  user?: IUser & { passwordChangedAt?: Date };
}

// Proteger rutas - verificar token
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1) Obtener token del header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw new AppError('No está autorizado, por favor inicie sesión', 401);
  }

  try {
    // 2) Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, iat?: number };

    // 3) Verificar si el usuario existe
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('El usuario perteneciente a este token ya no existe', 401);
    }

    // 4) Verificar si el usuario cambió la contraseña después de emitir el token
    if ((user as any).passwordChangedAt && decoded.iat && decoded.iat < ((user as any).passwordChangedAt.getTime() / 1000)) {
      throw new AppError('Usuario cambió recientemente la contraseña. Por favor inicie sesión nuevamente', 401);
    }

    // Otorgar acceso a la ruta protegida
    req.user = user;
    next();
  } catch (error) {
    throw new AppError('No está autorizado, token inválido', 401);
  }
});

// Restringir acceso por rol
export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('No tiene permiso para realizar esta acción', 403);
    }
    next();
  };
};

// Verificar estado de autenticación opcional
export const isLoggedIn = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.cookies?.jwt) {
    try {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // No hacer nada si hay error - simplemente no establecer req.user
    }
  }
  next();
});
