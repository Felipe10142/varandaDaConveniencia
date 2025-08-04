import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
interface MulterError extends Error {
    code: string;
    field: string;
}
export declare const errorHandler: (err: Error | AppError | MulterError, req: Request, res: Response, next: NextFunction) => void;
export {};
