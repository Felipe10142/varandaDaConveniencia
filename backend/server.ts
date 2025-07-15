import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { config } from './src/config/config';
import { connectDatabase } from './src/config/database';
import {
  limiter,
  corsOptions,
  securityHeaders,
  sanitizeData,
  preventXSS,
  preventParamPollution,
  compressResponse
} from './src/middleware/securityMiddleware';

// Importar configuración y middleware
import AppError from './src/utils/appError';
import { globalErrorHandler } from './src/utils/appError';

// Importar rutas
import userRoutes from './src/routes/userRoutes';
import productRoutes from './src/routes/productRoutes';
import orderRoutes from './src/routes/orderRoutes';
import reviewRoutes from './src/routes/reviewRoutes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app: Express = express();
const httpServer = createServer(app);

// Configurar Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware de seguridad y utilidades
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(sanitizeData);
app.use(preventXSS);
app.use(preventParamPollution);
app.use(compressResponse);
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static('uploads'));

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
  next(new Error(`No se encontró ${req.originalUrl} en este servidor!`));
});

// Manejo global de errores
app.use(globalErrorHandler);

// Configuración de WebSocket
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join_order_room', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  socket.on('order_status_update', (data) => {
    io.to(`order_${data.orderId}`).emit('order_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en modo ${process.env.NODE_ENV} en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Cerrando servidor...');
  console.log(err.name, err.message);
  httpServer.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Cerrando servidor...');
  httpServer.close(() => {
    console.log('💥 Proceso terminado!');
  });
});

startServer();
