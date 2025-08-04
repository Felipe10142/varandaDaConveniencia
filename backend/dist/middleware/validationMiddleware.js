import AppError from '../utils/appError';
export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        const error_message = JSON.parse(error.message);
        const message = error_message[0].message;
        return next(new AppError(message, 400));
    }
};
//# sourceMappingURL=validationMiddleware.js.map