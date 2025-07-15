import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config/config';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorMiddleware';
import {
  limiter,
  corsOptions,
  securityHeaders,
  sanitizeData,
  preventXSS,
  preventParamPollution,
  compressResponse,
  requestLogger
} from './middleware/securityMiddleware';

// Routes
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import uploadRoutes from './routes/uploadRoutes';

// Initialize express
export const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions
});

// Connect to database
connectDatabase();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser(config.jwtSecret));

// Security middlewares
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(sanitizeData);
app.use(preventXSS);
app.use(preventParamPollution);
app.use(compressResponse);

// Rate limiting
app.use('/api', limiter);

// Request logger
app.use(requestLogger);

// Static folder
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Order updates
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  // Chat functionality
  socket.on('joinChatRoom', (userId) => {
    socket.join(`chat_${userId}`);
  });

  socket.on('sendMessage', (data) => {
    io.to(`chat_${data.recipientId}`).emit('newMessage', data);
  });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});
