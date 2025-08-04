import multer from "multer";
import AppError from "../utils/appError";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    }
    else {
        cb(new AppError("Apenas imagens são permitidas!", 400));
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
export const uploadArray = (fieldName, maxCount) => {
    return upload.array(fieldName, maxCount);
};
export const uploadSingle = (fieldName) => {
    return upload.single(fieldName);
};
export const uploadFields = (fields) => {
    return upload.fields(fields);
};
//# sourceMappingURL=uploadMiddleware.js.map