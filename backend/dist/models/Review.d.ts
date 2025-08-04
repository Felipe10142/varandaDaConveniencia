import mongoose, { Document } from "mongoose";
export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    images?: string[];
    likes: mongoose.Types.ObjectId[];
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Review: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview> & IReview & {
    _id: mongoose.Types.ObjectId;
}, any>;
