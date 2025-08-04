import { Server } from "socket.io";
let io;
export const initializeSocketIO = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("Cliente conectado:", socket.id);
        socket.on("join_order_room", (orderId) => {
            socket.join(`order_${orderId}`);
            console.log(`Cliente ${socket.id} se unió a la sala order_${orderId}`);
        });
        socket.on("order_status_update", (data) => {
            io.to(`order_${data.orderId}`).emit("order_updated", data);
        });
        socket.on("new_order", (data) => {
            io.emit("order_received", data);
        });
        socket.on("stock_update", (data) => {
            io.emit("product_stock_updated", data);
        });
        socket.on("join_support_chat", (userId) => {
            socket.join(`support_${userId}`);
        });
        socket.on("support_message", (data) => {
            io.to(`support_${data.userId}`).emit("support_message_received", data);
        });
        socket.on("disconnect", () => {
            console.log("Cliente desconectado:", socket.id);
        });
    });
    return io;
};
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io no ha sido inicializado");
    }
    return io;
};
export const emitOrderUpdate = (orderId, updateData) => {
    getIO().to(`order_${orderId}`).emit("order_updated", updateData);
};
export const emitNewOrder = (orderData) => {
    getIO().emit("new_order", orderData);
};
export const emitStockUpdate = (productId, newStock) => {
    getIO().emit("product_stock_updated", { productId, newStock });
};
export const emitSupportMessage = (userId, messageData) => {
    getIO().to(`support_${userId}`).emit("support_message_received", messageData);
};
export const emitProductStatusChange = (productId, isAvailable) => {
    getIO().emit("product_status_changed", { productId, isAvailable });
};
//# sourceMappingURL=socketController.js.map