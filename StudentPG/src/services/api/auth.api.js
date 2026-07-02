import api from "./axios";

/**
 * ============================
 * AUTH API
 * ============================
 */

/**
 * Owner Register
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
 * Backend JWT ko HttpOnly Cookie me set karega.
 */
export const loginOwner = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

/**
 * Logout
 * POST /auth/logout
 */
export const logoutOwner = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

/**
 * Current Logged In Owner
 * GET /auth/me
 */
export const getCurrentOwner = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/**
 * Refresh Session (Optional)
 * POST /auth/refresh
 */
export const refreshSession = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

/**
 * Forgot Password
 * POST /auth/forgot-password
 */
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

/**
 * Reset Password
 * POST /auth/reset-password
 */
export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

/**
 * Change Password
 * POST /auth/change-password
 */
export const changePassword = async (data) => {
  const response = await api.post("/auth/change-password", data);
  return response.data;
};