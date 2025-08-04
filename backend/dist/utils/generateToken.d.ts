import { Types } from "mongoose";
export declare const generateToken: (id: string | Buffer) => string;
export declare const verifyToken: (token: string) => {
    id: string;
};
export declare const generateRefreshToken: (userId: Types.ObjectId | string) => string;
export declare const verifyRefreshToken: (token: string) => {
    id: string;
};
export declare const generateTempToken: (data: any, expiresIn?: string) => string;
export declare const verifyTempToken: (token: string) => any;
