import { CONFIG } from '@/constants/config';

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
}

/**
 * Handles client-side image uploads to Cloudinary using unsigned presets.
 */
export async function uploadImageToCloudinary(file: File): Promise<{ publicId: string; url: string }> {
  if (file.size > CONFIG.MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`File size exceeds maximum allowed limit of 5MB`);
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'tgsit4me';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'studentpg_unsigned';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload asset to Cloudinary infrastructure.');
  }

  const data = (await response.json()) as CloudinaryUploadResponse;

  return {
    publicId: data.public_id,
    url: data.secure_url,
  };
}