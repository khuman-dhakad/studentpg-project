import api from "./axios";

/**
 * ============================
 * AUTHENTICATION (LOGIN & SIGNUP)
 * ============================
 */

/**
 * Register a New Owner
 * POST /auth/register
 */
export const registerOwner = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

/**
 * Owner Login
 * POST /auth/login
 *
 * The backend will save the secure login token inside a protected cookie automatically.
 */
export const loginOwner = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

/**
 * Logout Owner
 * POST /auth/logout
 */
export const logoutOwner = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

/**
 * Get Current Logged In Owner Profile
 * GET /auth/me
 */
export const getCurrentOwner = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/**
 * Refresh Login Session (Optional)
 * POST /auth/refresh
 */
export const refreshSession = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

/**
 * Request Password Reset Link
 * POST /auth/forgot-password
 */
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

/**
 * Reset Password Using Token
 * POST /auth/reset-password
 */
export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

/**
 * Change Password While Logged In
 * POST /auth/change-password
 */
export const changePassword = async (data) => {
  const response = await api.post("/auth/change-password", data);
  return response.data;
};