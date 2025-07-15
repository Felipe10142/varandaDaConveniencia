import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../types/cloudinary';

// Configurar cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Subir archivo a cloudinary
export const uploadToCloudinary = async (
  file: string | Buffer,
  folder: string = 'varanda'
): Promise<CloudinaryResponse> => {
  try {
    const result = await cloudinary.uploader.upload(
      typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
      {
        folder,
        resource_type: 'auto',
      }
    );

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error: any) {
    throw new Error(`Error al subir archivo a Cloudinary: ${error.message}`);
  }
};

// Eliminar archivo de cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error: any) {
    throw new Error(`Error al eliminar archivo de Cloudinary: ${error.message}`);
  }
};

// Obtener URL firmada
export const getSignedUrl = async (
  publicId: string,
  options: {
    expires?: number;
    transformation?: any;
  } = {}
): Promise<string> => {
  const { expires = 3600, transformation = {} } = options;

  try {
    const signedUrl = cloudinary.url(publicId, {
      secure: true,
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + expires,
      transformation,
    });

    return signedUrl;
  } catch (error: any) {
    throw new Error(`Error al generar URL firmada: ${error.message}`);
  }
};

// Crear carpeta en cloudinary
export const createFolder = async (folderPath: string): Promise<void> => {
  try {
    await cloudinary.api.create_folder(folderPath);
  } catch (error: any) {
    throw new Error(`Error al crear carpeta en Cloudinary: ${error.message}`);
  }
};

// Eliminar carpeta de cloudinary
export const deleteFolder = async (folderPath: string): Promise<void> => {
  try {
    await cloudinary.api.delete_folder(folderPath);
  } catch (error: any) {
    throw new Error(`Error al eliminar carpeta de Cloudinary: ${error.message}`);
  }
};

// Listar recursos en una carpeta
export const listResources = async (
  folderPath: string,
  options: {
    resourceType?: string;
    type?: string;
    prefix?: string;
    maxResults?: number;
  } = {}
) => {
  try {
    const result = await cloudinary.api.resources({
      type: options.type || 'upload',
      prefix: `${folderPath}${options.prefix || ''}`,
      resource_type: options.resourceType || 'image',
      max_results: options.maxResults || 10,
    });

    return result.resources;
  } catch (error: any) {
    throw new Error(`Error al listar recursos de Cloudinary: ${error.message}`);
  }
};
