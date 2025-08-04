class AppError extends Error {
    statusCode;
    status;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
const handleCastErrorDB = (err) => {
    const message = `Inválido ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `O valor ${value} já está em uso. Por favor, use outro valor.`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Dados inválidos. ${errors.join(". ")}`;
    return new AppError(message, 400);
};
const handleJWTError = () => new AppError("Token inválido. Por favor, faça login novamente.", 401);
const handleJWTExpiredError = () => new AppError("Token expirado. Por favor, faça login novamente.", 401);
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    console.error("ERROR 💥", err);
    return res.status(err.statusCode).render("error", {
        title: "Algo salió mal!",
        msg: err.message,
    });
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        console.error("ERROR 💥", err);
        return res.status(500).json({
            status: "error",
            message: "Algo salió muy mal!",
        });
    }
    if (err.isOperational) {
        return res.status(err.statusCode).render("error", {
            title: "Algo salió mal!",
            msg: err.message,
        });
    }
    console.error("ERROR 💥", err);
    return res.status(err.statusCode).render("error", {
        title: "Algo salió mal!",
        msg: "Por favor intente más tarde.",
    });
};
export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError")
            error = handleJWTError();
        if (error.name === "TokenExpiredError")
            error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};
export default AppError;
//# sourceMappingURL=appError.js.map