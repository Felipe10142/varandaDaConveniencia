
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import AppError from '../utils/appError';

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      const error_message = JSON.parse(error.message);
      const message = error_message[0].message;
      return next(new AppError(message, 400));
    }
  };
