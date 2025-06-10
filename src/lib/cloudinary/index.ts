import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

// Type definitions
interface CloudinaryConfig {
  cloud_name: string;
  api_key: string | undefined;
  api_secret: string | undefined;
  secure: boolean;
}

interface UploadResult {
  public_id: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

// Validate required environment variables
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} is not set in environment variables`);
  }
}

// Configure Cloudinary
const config: CloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
};

cloudinary.config(config);

export async function uploadImage(file: File | string): Promise<UploadResult> {
  try {
    const bytes = typeof file === 'string'
      ? Buffer.from(file, 'base64')
      : Buffer.from(await file.arrayBuffer());
    
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'nyika-safaris' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error('No result from Cloudinary upload'));
          }
          resolve(result);
        },
      );
      uploadStream.end(bytes);
    });

    if (!uploadResult.public_id || !uploadResult.secure_url) {
      throw new Error('Invalid response from Cloudinary');
    }

    return {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error uploading image to Cloudinary:', errorMessage);
    throw new Error(`Failed to upload image: ${errorMessage}`);
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error deleting image from Cloudinary:', errorMessage);
    throw new Error(`Failed to delete image: ${errorMessage}`);
  }
}
