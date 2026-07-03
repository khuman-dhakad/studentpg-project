import api from "./axios";

/**
 * ============================
 * STUDENT INQUIRY API
 * ============================
 */

/**
 * Send Inquiry Form (From Student to PG Owner)
 * POST /inquiries
 */
export const sendInquiry = async (data) => {
  const response = await api.post("/inquiries", data);
  return response.data;
};

/**
 * Get All Inquiries (Admin View)
 * GET /inquiries
 */
export const getAllInquiries = async () => {
  const response = await api.get("/inquiries");
  return response.data;
};

/**
 * Get All Inquiries Received by a Specific Owner
 * GET /inquiries/owner/:ownerId
 */
export const getOwnerInquiries = async (ownerId) => {
  const response = await api.get(
    `/inquiries/owner/${ownerId}`
  );
  return response.data;
};

/**
 * Get Single Inquiry Details by ID
 * GET /inquiries/:id
 */
export const getInquiryById = async (id) => {
  const response = await api.get(`/inquiries/${id}`);
  return response.data;
};

/**
 * Mark a Received Inquiry as Read
 * PATCH /inquiries/:id/read
 */
export const markInquiryAsRead = async (id) => {
  const response = await api.patch(
    `/inquiries/${id}/read`
  );
  return response.data;
};

/**
 * Send a Reply Message to an Inquiry
 * POST /inquiries/:id/reply
 */
export const replyToInquiry = async (id, data) => {
  const response = await api.post(
    `/inquiries/${id}/reply`,
    data
  );

  return response.data;
};

/**
 * Delete an Inquiry from the Dashboard
 * DELETE /inquiries/:id
 */
export const deleteInquiry = async (id) => {
  const response = await api.delete(`/inquiries/${id}`);
  return response.data;
};