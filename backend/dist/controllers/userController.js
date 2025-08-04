import asyncHandler from "express-async-handler";
import { User } from "../models/User";
import { Order } from "../models/Order";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../utils/generateToken";
import { Email } from "../utils/email";
import AppError from "../utils/appError";
import crypto from "crypto";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import sharp from "sharp";
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new AppError("Usuário já existe", 400);
    }
    const user = await User.create({
        name,
        email,
        password,
        avatar: "default-avatar.png",
    });
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.status(201).json({
        status: "sucesso",
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token,
            refreshToken,
        },
    });
});
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError("Email ou senha incorretos", 401);
    }
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.status(200).json({
        status: "sucesso",
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token,
            refreshToken,
        },
    });
});
export const logoutUser = asyncHandler(async (req, res) => {
    if (req.user) {
        req.user.refreshToken = undefined;
        await req.user.save();
    }
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "sucesso" });
});
export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new AppError("Refresh token requerido", 400);
    }
    try {
        const { id } = verifyRefreshToken(refreshToken);
        const user = await User.findById(id);
        if (!user || user.refreshToken !== refreshToken) {
            throw new AppError("Refresh token inválido", 401);
        }
        const newAccessToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();
        res.status(200).json({
            status: "sucesso",
            data: {
                token: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    }
    catch (err) {
        throw new AppError("Refresh token inválido ou expirado", 401);
    }
});
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new AppError("Usuário não encontrado", 404);
    }
    const orderStats = await Order.aggregate([
        { $match: { user: user._id } },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: "$totalPrice" },
            },
        },
    ]);
    res.status(200).json({
        status: "sucesso",
        data: {
            user,
            stats: orderStats[0] || { totalOrders: 0, totalSpent: 0 },
        },
    });
});
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new AppError("Usuário não encontrado", 404);
    }
    if (req.file) {
        if (user.avatar && !user.avatar.includes("default-avatar")) {
            await deleteFromCloudinary(user.avatar);
        }
        const buffer = await sharp(req.file.buffer)
            .resize(200, 200)
            .jpeg({ quality: 90 })
            .toBuffer();
        const result = await uploadToCloudinary(buffer);
        req.body.avatar = result.secure_url;
    }
    Object.assign(user, req.body);
    const updatedUser = await user.save();
    res.status(200).json({
        status: "sucesso",
        data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            address: updatedUser.address,
            phoneNumber: updatedUser.phoneNumber,
        },
    });
});
export const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(limit).sort("-createdAt");
    const total = await User.countDocuments();
    const pages = Math.ceil(total / limit);
    res.status(200).json({
        status: "sucesso",
        results: users.length,
        pagination: {
            current: page,
            pages,
            total,
        },
        data: users,
    });
});
export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new AppError("Usuário não encontrado", 404);
    }
    res.status(200).json({
        status: "sucesso",
        data: user,
    });
});
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new AppError("Usuário não encontrado", 404);
    }
    if (req.file) {
        if (user.avatar && !user.avatar.includes("default-avatar")) {
            await deleteFromCloudinary(user.avatar);
        }
        const buffer = await sharp(req.file.buffer)
            .resize(200, 200)
            .jpeg({ quality: 90 })
            .toBuffer();
        const result = await uploadToCloudinary(buffer);
        req.body.avatar = result.secure_url;
    }
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
        status: "sucesso",
        data: updatedUser,
    });
});
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new AppError("Usuário não encontrado", 404);
    }
    if (user.avatar && !user.avatar.includes("default-avatar")) {
        await deleteFromCloudinary(user.avatar);
    }
    await User.findByIdAndDelete(user._id);
    res.status(204).json({
        status: "sucesso",
        data: null,
    });
});
export const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new AppError("Não há usuário com esse email", 404);
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    try {
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();
        res.status(200).json({
            status: "sucesso",
            message: "Token enviado para o email",
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw new AppError("Ocorreu um erro ao enviar o email. Tente novamente mais tarde.", 500);
    }
});
export const resetPassword = asyncHandler(async (req, res) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        throw new AppError("Token inválido ou expirado", 400);
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.status(200).json({
        status: "sucesso",
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
            refreshToken,
        },
    });
});
export const verifyEmail = asyncHandler(async (req, res) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user) {
        throw new AppError("Token inválido ou expirado", 400);
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.status(200).json({
        status: "sucesso",
        message: "Email verificado com sucesso",
    });
});
export const uploadAvatar = asyncHandler(async (req, res, next) => {
    if (!req.file)
        return next();
    req.file.filename = `user-${req.user?._id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});
//# sourceMappingURL=userController.js.map