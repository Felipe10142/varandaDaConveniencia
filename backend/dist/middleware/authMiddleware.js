import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/User";
import AppError from "../utils/appError";
export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        throw new AppError("No está autorizado, por favor inicie sesión", 401);
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            throw new AppError("El usuario perteneciente a este token ya no existe", 401);
        }
        if (user.passwordChangedAt &&
            decoded.iat &&
            decoded.iat < user.passwordChangedAt.getTime() / 1000) {
            throw new AppError("Usuario cambió recientemente la contraseña. Por favor inicie sesión nuevamente", 401);
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new AppError("No está autorizado, token inválido", 401);
    }
});
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AppError("No tiene permiso para realizar esta acción", 403);
        }
        next();
    };
};
export const isLoggedIn = asyncHandler(async (req, res, next) => {
    if (req.cookies?.jwt) {
        try {
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            if (user) {
                req.user = user;
            }
        }
        catch (error) {
        }
    }
    next();
});
//# sourceMappingURL=authMiddleware.js.map