import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api", // Fixed to match your backend friend's base path

  timeout: 15000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * ⚙️ Centralized .env Endpoint Configuration Maps 
 * Updated with exact routes provided by your backend teammate.
 */
export const ENDPOINTS = {
  auth: {
    register: import.meta.env.VITE_API_AUTH_REGISTER || '/owners/register',
    login: import.meta.env.VITE_API_AUTH_LOGIN || '/owners/login',
    me: import.meta.env.VITE_API_AUTH_ME || '/owners/profile',
    updateProfile: import.meta.env.VITE_API_AUTH_UPDATE_PROFILE || '/owners/profile',
    changePassword: import.meta.env.VITE_API_AUTH_CHANGE_PASSWORD || '/owners/change-password',
  },
  pgs: {
    base: import.meta.env.VITE_API_PGS_BASE || '/pgs',
    owner: import.meta.env.VITE_API_PGS_OWNER || '/pgs/owner',
    imagesSuffix: import.meta.env.VITE_API_PGS_IMAGES_SUFFIX || '/images', // Added for POST/PUT/DELETE /pgs/:id/images
    filter: import.meta.env.VITE_API_PGS_FILTER || '/pgs/filter',
    featured: import.meta.env.VITE_API_PGS_FEATURED || '/pgs/featured',
  },
  inquiries: {
    base: import.meta.env.VITE_API_INQUIRIES_BASE || '/inquiries',
    owner: import.meta.env.VITE_API_INQUIRIES_OWNER || '/inquiries/owner',
  },
  amenities: {
    base: import.meta.env.VITE_API_AMENITIES_BASE || '/amenities',
  }
};

/**
 * Request Interceptor
 */

api.interceptors.request.use(
  (config) => {
    // Basic payload validation
    if (config.data && typeof config.data === "object") {
      const payload = JSON.stringify(config.data);

      // Block simple script injections
      if (
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(payload)
      ) {
        return Promise.reject({
          status: 400,
          message: "Invalid request payload.",
        });
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    const responseError = {
      status,
      message: "Something went wrong.",
      data: error.response?.data,
    };

    switch (status) {
      case 400:
        responseError.message =
          error.response?.data?.message || "Invalid request.";
        break;

      case 401:
        responseError.message =
          "Session expired. Please login again.";

        // Prevent redirect loop
        if (!window.location.pathname.includes("/owner/login")) {
          window.location.replace("/owner/login");
        }

        break;

      case 403:
        responseError.message = "Access denied.";
        break;

      case 404:
        responseError.message = "Requested resource not found.";
        break;

      case 409:
        responseError.message =
          error.response?.data?.message || "Conflict occurred.";
        break;

      case 422:
        responseError.message =
          error.response?.data?.message || "Validation failed.";
        break;

      case 429:
        responseError.message =
          "Too many requests. Please try again later.";
        break;

      case 500:
        responseError.message =
          "Internal server error.";
        break;

      case 503:
        responseError.message =
          "Service temporarily unavailable.";
        break;

      default:
        if (!navigator.onLine) {
          responseError.message =
            "No internet connection.";
        }
    }

    return Promise.reject(responseError);
  }
);

export default api;