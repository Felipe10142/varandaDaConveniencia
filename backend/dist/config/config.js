import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "development"}`),
});
export const config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/varanda",
    dbName: process.env.MONGODB_DB_NAME || "varanda",
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    jwtExpire: process.env.JWT_EXPIRE || "7d",
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        currency: "brl",
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM,
    },
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
};
//# sourceMappingURL=config.js.map