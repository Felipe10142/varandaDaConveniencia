import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = async (file, folder = "varanda") => {
    try {
        const result = await cloudinary.uploader.upload(typeof file === "string"
            ? file
            : `data:image/jpeg;base64,${file.toString("base64")}`, {
            folder,
            resource_type: "auto",
        });
        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
        };
    }
    catch (error) {
        throw new Error(`Error al subir archivo a Cloudinary: ${error.message}`);
    }
};
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    }
    catch (error) {
        throw new Error(`Error al eliminar archivo de Cloudinary: ${error.message}`);
    }
};
export const getSignedUrl = async (publicId, options = {}) => {
    const { expires = 3600, transformation = {} } = options;
    try {
        const signedUrl = cloudinary.url(publicId, {
            secure: true,
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + expires,
            transformation,
        });
        return signedUrl;
    }
    catch (error) {
        throw new Error(`Error al generar URL firmada: ${error.message}`);
    }
};
export const createFolder = async (folderPath) => {
    try {
        await cloudinary.api.create_folder(folderPath);
    }
    catch (error) {
        throw new Error(`Error al crear carpeta en Cloudinary: ${error.message}`);
    }
};
export const deleteFolder = async (folderPath) => {
    try {
        await cloudinary.api.delete_folder(folderPath);
    }
    catch (error) {
        throw new Error(`Error al eliminar carpeta de Cloudinary: ${error.message}`);
    }
};
export const listResources = async (folderPath, options = {}) => {
    try {
        const result = await cloudinary.api.resources({
            type: options.type || "upload",
            prefix: `${folderPath}${options.prefix || ""}`,
            resource_type: options.resourceType || "image",
            max_results: options.maxResults || 10,
        });
        return result.resources;
    }
    catch (error) {
        throw new Error(`Error al listar recursos de Cloudinary: ${error.message}`);
    }
};
//# sourceMappingURL=cloudinary.js.map