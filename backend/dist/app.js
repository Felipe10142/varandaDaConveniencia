import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/config";
import { errorHandler } from "./middleware/errorMiddleware";
import { limiter, corsOptions, securityHeaders, sanitizeData, preventXSS, preventParamPollution, compressResponse, requestLogger, } from "./middleware/securityMiddleware";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import uploadRoutes from "./routes/uploadRoutes";
export const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: corsOptions,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.jwtSecret));
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(sanitizeData);
app.use(preventXSS);
app.use(preventParamPollution);
app.use(compressResponse);
app.use("/api", limiter);
app.use(requestLogger);
app.use("/uploads", express.static("uploads"));
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
    socket.on("joinOrderRoom", (orderId) => {
        socket.join(`order_${orderId}`);
    });
    socket.on("joinChatRoom", (userId) => {
        socket.join(`chat_${userId}`);
    });
    socket.on("sendMessage", (data) => {
        io.to(`chat_${data.recipientId}`).emit("newMessage", data);
    });
});
app.use(errorHandler);
export { httpServer };
//# sourceMappingURL=app.js.map