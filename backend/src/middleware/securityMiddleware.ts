import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { CorsOptions } from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// Puede requerir: npm install --save-dev @types/xss-clean @types/hpp
// Solución temporal para evitar errores de linter si no existen los tipos
// @ts-ignore
import xss from 'xss-clean';
// @ts-ignore
import hpp from 'hpp';
import compression from 'compression';

// Rate limiting
export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// CORS configuration
export const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Security headers using helmet
export const securityHeaders = helmet();

// Data sanitization against NoSQL query injection
export const sanitizeData = mongoSanitize();

// Data sanitization against XSS
export const preventXSS = xss();

// Prevent parameter pollution
export const preventParamPollution = hpp({
  whitelist: [
    'price',
    'rating',
    'category',
    'stock',
    'sort',
    'fields',
    'page',
    'limit'
  ]
});

// Compress responses
export const compressResponse = compression();

// Request Logger
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
};

// Not Found Handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
