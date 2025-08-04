import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import compression from "compression";
export const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
});
export const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
export const securityHeaders = helmet();
export const sanitizeData = mongoSanitize();
export const preventXSS = xss();
export const preventParamPollution = hpp({
    whitelist: [
        "price",
        "rating",
        "category",
        "stock",
        "sort",
        "fields",
        "page",
        "limit",
    ],
});
export const compressResponse = compression();
export const requestLogger = (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log(`${req.method} ${req.originalUrl}`);
    }
    next();
};
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
//# sourceMappingURL=securityMiddleware.js.map