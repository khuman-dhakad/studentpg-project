import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api", 

  timeout: 15000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * ⚙️ Centralized .env Endpoint Configuration Maps 
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
    base: import.meta.env.VITE_API_PGS_BASE || '/student/pgs',
    owner: import.meta.env.VITE_API_PGS_OWNER || '/pgs/owner',
    imagesSuffix: import.meta.env.VITE_API_PGS_IMAGES_SUFFIX || '/images', 
    filter: import.meta.env.VITE_API_PGS_FILTER || '/student/pgs/filter',
    featured: import.meta.env.VITE_API_PGS_FEATURED || '/student/pgs/featured',
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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data && typeof config.data === "object") {
      const payload = JSON.stringify(config.data);
      if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(payload)) {
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
    const currentPath = window.location.pathname; 
    const configUrl = error.config?.url || "";

    const responseError = {
      status,
      message: "Something went wrong.",
      data: error.response?.data,
    };

    switch (status) {
      case 400:
        responseError.message = error.response?.data?.message || "Invalid request.";
        break;

      case 401:
        // ✅ Standard error response assignment overrides
        responseError.message = error.response?.data?.message || "Session expired or unauthorized node access.";

        // ✅ FIXED BYPASS FOR STUDENT CONTROLLER ROUTE AND INQUIRY ENGINE
        const isPublicBrowse = 
          currentPath === "/" || 
          currentPath.includes("/search") || 
          currentPath.includes("/pg/") ||
          configUrl.includes('/student/pgs/filter') ||
          configUrl.includes('/student/pgs') ||
          configUrl.includes('/inquiries') || // 🟢 Added this so inquiry submissions don't trigger hard owner logouts
          configUrl.includes(ENDPOINTS.inquiries.base) || // 🟢 Added centralized map safety rule
          configUrl.includes(ENDPOINTS.pgs.filter);
          
        const isAuthPage = currentPath.includes("/owner/login") || currentPath.includes("/owner/register");
        const isProfileCheck = configUrl.includes(ENDPOINTS.auth.me) || configUrl.includes('/owners/profile');

        if (!isPublicBrowse && !isAuthPage && !isProfileCheck) {
          localStorage.removeItem("token");
          delete api.defaults.headers.common['Authorization'];
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
        responseError.message = error.response?.data?.message || "Conflict occurred.";
        break;

      case 422:
        responseError.message = error.response?.data?.message || "Validation failed.";
        break;

      case 500:
        responseError.message = "Internal server error.";
        break;

      default:
        if (!navigator.onLine) {
          responseError.message = "No internet connection.";
        }
    }

    return Promise.reject(responseError);
  }
);

export default api;