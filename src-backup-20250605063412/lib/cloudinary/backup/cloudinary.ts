import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(file: File | string, folder: string = 'nyika-safaris'): Promise<string> {
  try {
    let uploadData: string | Buffer;
    if (typeof file === 'string') {
      uploadData = file;
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadData = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    const result = await cloudinary.uploader.upload(uploadData, {
      folder,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
}

export function getPublicIdFromUrl(url: string): string | null {
  const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches ? matches[1] : null;
}
