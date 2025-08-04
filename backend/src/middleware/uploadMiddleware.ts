import multer from "multer";
import { Request } from "express";
import AppError from "../utils/appError";

// Multer configuration with memory storage for Cloudinary
const storage = multer.memoryStorage();

// File filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    file.originalname.toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new AppError("Apenas imagens são permitidas!", 400));
  }
};

// Export multer middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Array upload middleware
export const uploadArray = (fieldName: string, maxCount: number) => {
  return upload.array(fieldName, maxCount);
};

// Single upload middleware
export const uploadSingle = (fieldName: string) => {
  return upload.single(fieldName);
};

// Multiple fields upload middleware
export const uploadFields = (fields: multer.Field[]) => {
  return upload.fields(fields);
};
