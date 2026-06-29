import api from "./axios";

/**
 * ============================
 * INQUIRY API
 * ============================
 */

/**
 * Send Inquiry (Student -> PG Owner)
 * POST /inquiries
 */
export const sendInquiry = async (data) => {
  const response = await api.post("/inquiries", data);
  return response.data;
};

/**
 * Get All Inquiries (Admin/Owner)
 * GET /inquiries
 */
export const getAllInquiries = async () => {
  const response = await api.get("/inquiries");
  return response.data;
};

/**
 * Get Inquiries by Owner
 * GET /inquiries/owner/:ownerId
 */
export const getOwnerInquiries = async (ownerId) => {
  const response = await api.get(
    `/inquiries/owner/${ownerId}`
  );
  return response.data;
};

/**
 * Get Inquiry by ID
 * GET /inquiries/:id
 */
export const getInquiryById = async (id) => {
  const response = await api.get(`/inquiries/${id}`);
  return response.data;
};

/**
 * Mark Inquiry as Read
 * PATCH /inquiries/:id/read
 */
export const markInquiryAsRead = async (id) => {
  const response = await api.patch(
    `/inquiries/${id}/read`
  );
  return response.data;
};

/**
 * Reply to Inquiry
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
 * Delete Inquiry
 * DELETE /inquiries/:id
 */
export const deleteInquiry = async (id) => {
  const response = await api.delete(`/inquiries/${id}`);
  return response.data;
};