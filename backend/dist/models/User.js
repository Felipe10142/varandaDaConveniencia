import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Por favor ingrese su nombre"],
        trim: true,
        maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
    },
    email: {
        type: String,
        required: [true, "Por favor ingrese su email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Por favor ingrese un email válido",
        ],
    },
    password: {
        type: String,
        required: [true, "Por favor ingrese una contraseña"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    avatar: {
        type: String,
        default: "default-avatar.png",
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
    },
    phoneNumber: {
        type: String,
        match: [
            /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
            "Por favor ingrese un número de teléfono válido",
        ],
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
    },
    refreshToken: {
        type: String,
        select: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.virtual("orders", {
    ref: "Order",
    localField: "_id",
    foreignField: "user",
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw new Error("Error al comparar contraseñas");
    }
};
userSchema.methods.createPasswordResetToken = function () {
    const crypto = require("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map