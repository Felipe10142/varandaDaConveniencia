import mongoose from "mongoose";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initializeSocketIO = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Unirse a sala de orden específica
    socket.on("join_order_room", (orderId: string) => {
      socket.join(`order_${orderId}`);
      console.log(`Cliente ${socket.id} se unió a la sala order_${orderId}`);
    });

    // Actualización de estado de orden
    socket.on(
      "order_status_update",
      (data: { orderId: string; status: string; updatedAt: Date }) => {
        io.to(`order_${data.orderId}`).emit("order_updated", data);
      },
    );

    // Notificación de nuevo pedido
    socket.on(
      "new_order",
      (data: { orderId: string; userId: string; total: number }) => {
        io.emit("order_received", data);
      },
    );

    // Actualización de stock
    socket.on(
      "stock_update",
      (data: { productId: string; newStock: number }) => {
        io.emit("product_stock_updated", data);
      },
    );

    // Chat de soporte
    socket.on("join_support_chat", (userId: string) => {
      socket.join(`support_${userId}`);
    });

    socket.on(
      "support_message",
      (data: { userId: string; message: string; isAdmin: boolean }) => {
        io.to(`support_${data.userId}`).emit("support_message_received", data);
      },
    );

    // Desconexión
    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado");
  }
  return io;
};

// Emisores de eventos

// Notificar actualización de orden
export const emitOrderUpdate = (orderId: string, updateData: any) => {
  getIO().to(`order_${orderId}`).emit("order_updated", updateData);
};

// Notificar nuevo pedido a administradores
export const emitNewOrder = (orderData: any) => {
  getIO().emit("new_order", orderData);
};

// Notificar actualización de stock
export const emitStockUpdate = (productId: string, newStock: number) => {
  getIO().emit("product_stock_updated", { productId, newStock });
};

// Notificar mensaje de soporte
export const emitSupportMessage = (userId: string, messageData: any) => {
  getIO().to(`support_${userId}`).emit("support_message_received", messageData);
};

// Notificar cambio de estado de producto
export const emitProductStatusChange = (
  productId: string,
  isAvailable: boolean,
) => {
  getIO().emit("product_status_changed", { productId, isAvailable });
};
