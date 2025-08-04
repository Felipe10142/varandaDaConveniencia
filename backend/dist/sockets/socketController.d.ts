import { Server } from "socket.io";
import { Server as HttpServer } from "http";
export declare const initializeSocketIO: (httpServer: HttpServer) => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const getIO: () => Server;
export declare const emitOrderUpdate: (orderId: string, updateData: any) => void;
export declare const emitNewOrder: (orderData: any) => void;
export declare const emitStockUpdate: (productId: string, newStock: number) => void;
export declare const emitSupportMessage: (userId: string, messageData: any) => void;
export declare const emitProductStatusChange: (productId: string, isAvailable: boolean) => void;
