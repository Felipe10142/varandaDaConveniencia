import AppError from "../utils/appError";
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error(err);
    if (err.name === "CastError") {
        const message = "Resource not found";
        error = new AppError(message, 404);
    }
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new AppError(message, 400);
    }
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new AppError(message.join(", "), 400);
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        const message = "File size is too large. Maximum size is 5MB";
        error = new AppError(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token. Please log in again";
        error = new AppError(message, 401);
    }
    if (err.name === "TokenExpiredError") {
        const message = "Your token has expired. Please log in again";
        error = new AppError(message, 401);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
//# sourceMappingURL=errorMiddleware.js.map