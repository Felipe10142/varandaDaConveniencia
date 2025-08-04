import mongoose, { Document } from "mongoose";
export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: {
        product: mongoose.Types.ObjectId;
        quantity: number;
        price: number;
        name: string;
    }[];
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    paymentMethod: "card" | "cash" | "pix";
    paymentResult?: {
        id: string;
        status: string;
        updateTime: string;
        email: string;
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    status: "pending" | "processing" | "completed" | "cancelled";
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder> & IOrder & {
    _id: mongoose.Types.ObjectId;
}, any>;
