import cloudinary from '../../config/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export interface CloudinaryUploadOptions {
  folder?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  format?: string;
  transformation?: any[];
}

export const cloudinaryService = {
  upload: async (
    filePath: string | Buffer,
    options: CloudinaryUploadOptions = {}
  ): Promise<UploadApiResponse> => {
    try {
      const uploadOptions = {
        folder: options.folder || 'oxymore',
        resource_type: options.resource_type || 'auto',
        ...options,
      };

      const result = await cloudinary.uploader.upload(filePath as string, uploadOptions);
      return result;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  },

  uploadFromBuffer: async (
    buffer: Buffer,
    options: CloudinaryUploadOptions = {}
  ): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: options.folder || 'oxymore',
        resource_type: options.resource_type || 'auto',
        ...options,
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else if (result) {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });
  },

  uploadFromBase64: async (
    base64Image: string,
    options: CloudinaryUploadOptions = {}
  ): Promise<UploadApiResponse> => {
    try {
      const uploadOptions = {
        folder: options.folder || 'oxymore',
        resource_type: options.resource_type || 'image',
        ...options,
      };

      const result = await cloudinary.uploader.upload(base64Image, uploadOptions);
      return result;
    } catch (error) {
      console.error('Error uploading base64 to Cloudinary:', error);
      throw error;
    }
  },

  delete: async (
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image'
  ): Promise<any> => {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  },

  url: (publicId: string, transformation?: any[]): string => {
    return cloudinary.url(publicId, {
      transformation: transformation,
    });
  },
};