/**
 * CLOUDINARY PHOTO STORAGE MANAGEMENT
 * This file handles uploading images to cloud storage and getting secure image link URLs.
 */

/**
 * UPLOAD - Send a Single Image File to Cloudinary
 * @param {File} file - Image file chosen via browser input fields
 * @returns {Promise<string>} - Returns a secure image link URL to save in your MongoDB database
 */
export const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("Please select a file to upload.");
  }

  // Reads the setup keys directly from your environment file (.env)
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Configuration check safeguard
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error("Cloudinary Configuration Error: Environment keys are missing.");
    throw new Error("Cloud storage setup is incomplete. Check your .env file keys.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Cloudinary error response:", errorData); // Help in debugging 400 Bad Request
      throw new Error(errorData?.error?.message || "The storage service could not accept the image.");
    }

    const data = await res.json();
    return data.secure_url; // 👈 This secure link gets saved straight into MongoDB
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};

/**
 * RENDER OPTIMIZER - Compresses and sizes images dynamically on-the-fly
 * Note: No API call needed here! Use the returned URL directly in <img src={url} />.
 * This helper injects settings into the URL to auto-compress the image so pages load faster.
 */
export const getOptimizedUrl = (url, width = 500, height = 500) => {
  if (!url) return "";
  // If the image belongs to cloudinary, inject sizing and auto-compression commands into the URL string
  if (url.includes("res.cloudinary.com")) {
    return url.replace("/upload/", `/upload/c_fill,g_auto,w_${width},h_${height},q_auto,f_auto/`);
  }
  return url;
};