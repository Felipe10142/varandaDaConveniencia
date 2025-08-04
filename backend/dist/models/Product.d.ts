import mongoose, { Document } from "mongoose";
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isAvailable: boolean;
    rating: number;
    numReviews: number;
    discount?: {
        percentage: number;
        validUntil: Date;
    };
    nutritionalInfo?: {
        calories: number;
        proteins: number;
        carbs: number;
        fats: number;
        ingredients: string[];
        allergens: string[];
    };
    preparation?: {
        time: number;
        instructions: string[];
    };
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct> & IProduct & {
    _id: mongoose.Types.ObjectId;
}, any>;
