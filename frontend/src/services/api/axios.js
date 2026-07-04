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
 * ⚙️ List of All API URLs (Loads settings from your .env file or uses default links)
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
 * Request Interceptor (Runs code automatically right before sending data to server)
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Safety check to prevent dangerous script tags from being sent to the database
    if (config.data && typeof config.data === "object") {
      const payload = JSON.stringify(config.data);
      if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(payload)) {
        return Promise.reject({
          status: 400,
          message: "Data contains unsafe content.",
        });
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor (Checks data coming back from the server for errors)
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
        responseError.message = error.response?.data?.message || "Session expired. Please log in again.";

        // ✅ ALLOW STUDENTS TO BROWSE AND SUBMIT FORMS WITHOUT BEING LOGGED IN AS AN OWNER
        const isPublicBrowse = 
          currentPath === "/" || 
          currentPath.includes("/search") || 
          currentPath.includes("/pg/") ||
          configUrl.includes('/student/pgs/filter') ||
          configUrl.includes('/student/pgs') ||
          configUrl.includes('/inquiries') || // 🟢 Prevents student inquiry forms from forcing an owner logout
          configUrl.includes(ENDPOINTS.inquiries.base) || // 🟢 Standard link protection rule
          configUrl.includes(ENDPOINTS.pgs.filter);
          
        const isAuthPage = currentPath.includes("/owner/login") || currentPath.includes("/owner/register");
        const isProfileCheck = configUrl.includes(ENDPOINTS.auth.me) || configUrl.includes('/owners/profile');

        // If the user isn't on a public page and login is expired, remove old tokens and send to login screen
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
        responseError.message = "Requested item not found.";
        break;

      case 409:
        responseError.message = error.response?.data?.message || "This information already exists.";
        break;

      case 422:
        responseError.message = error.response?.data?.message || "Please check your inputs and try again.";
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