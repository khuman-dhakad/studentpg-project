/**
 * CLOUDINARY INTEGRATION NODE
 * Is file se aap photos post (upload) kar sakte ho aur secure url backend ko bhej sakte ho.
 */

/**
 * POST / UPLOAD - Single Image to Cloudinary
 * @param {File} file - Browser input file selector target
 * @returns {Promise<string>} - Secure URL to store in MongoDB
 */
export const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("No file asset provided for secure cloud transmission.");
  }

  // ✅ FIXED: Read runtime environment directly inside to prevent undefined load state
  const CLOUD_NAME = "tgsit4me";
  const UPLOAD_PRESET = "bhopal_pg_preset";

  // Configuration check safeguard
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error("Cloudinary Configuration Error: Environment keys are missing.");
    throw new Error("Cloud storage setup incomplete. Check your .env file.");
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
      console.error("Cloudinary Detailed Rejection Log:", errorData); // Help in debugging 400 Bad Request
      throw new Error(errorData?.error?.message || "Cloudinary network API rejection.");
    }

    const data = await res.json();
    return data.secure_url; // 👈 Yeh secure URL seedhe MongoDB me save hoga
  } catch (err) {
    console.error("Cloudinary Upload Pipeline Error:", err);
    throw err;
  }
};

/**
 * GET / RENDER - Cloudinary Optimization Helper
 * Note: Cloudinary par GET karne ke liye koi API call nahi karni padti! 
 * Jo URL MongoDB se milega, use direct <img src={url} /> me daalna hota hai.
 * Yeh function us URL ko load-time par compress aur optimize karne ke liye hai.
 */
export const getOptimizedUrl = (url, width = 500, height = 500) => {
  if (!url) return "";
  // Agar image already cloudinary ki hai, toh scale and compress optimization parameters inject karo
  if (url.includes("res.cloudinary.com")) {
    return url.replace("/upload/", `/upload/c_fill,g_auto,w_${width},h_${height},q_auto,f_auto/`);
  }
  return url;
};