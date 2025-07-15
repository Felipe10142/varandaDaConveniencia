import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import path from 'path';

// Importar configuración y middleware
import { connectDB } from './config/database';
import { globalErrorHandler } from './utils/appError';

// Importar rutas
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';

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

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Limitar solicitudes desde la misma IP
const limiter = rateLimit({
  max: 100, // máximo 100 solicitudes
  windowMs: 60 * 60 * 1000, // 1 hora
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo en una hora'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Sanitización de datos
app.use(mongoSanitize());
app.use(xss());

// Logging en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Compresión de respuestas
app.use(compression());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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
    await connectDB();
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
