import { CloudinaryResponse } from "../types/cloudinary";
export declare const uploadToCloudinary: (file: string | Buffer, folder?: string) => Promise<CloudinaryResponse>;
export declare const deleteFromCloudinary: (publicId: string) => Promise<boolean>;
export declare const getSignedUrl: (publicId: string, options?: {
    expires?: number;
    transformation?: any;
}) => Promise<string>;
export declare const createFolder: (folderPath: string) => Promise<void>;
export declare const deleteFolder: (folderPath: string) => Promise<void>;
export declare const listResources: (folderPath: string, options?: {
    resourceType?: string;
    type?: string;
    prefix?: string;
    maxResults?: number;
}) => Promise<any>;
