import { CONFIG } from '@/constants/config';

interface UploadResponse {
  publicId: string;
  url: string;
}

/**
 * Handles authenticated image uploads through the backend infrastructure.
 * Server verifies owner authentication, enforces MIME type and size limits,
 * and uploads to Cloudinary using secure server-side credentials.
 */
export async function uploadImageToCloudinary(file: File): Promise<{ publicId: string; url: string }> {
  if (file.size > CONFIG.MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`File size exceeds maximum allowed limit of 5MB`);
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/owner/pgs/images/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to upload asset.');
  }

  const data = (await response.json()) as UploadResponse;

  return {
    publicId: data.publicId,
    url: data.url,
  };
}