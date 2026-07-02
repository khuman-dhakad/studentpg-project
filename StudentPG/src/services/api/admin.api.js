import api from "./axios";

/**
 * Get All Pending PG Listings for Admin Review
 * GET /admin/listings/pending
 */
export const getPendingListings = async () => {
  const response = await api.get("/admin/listings/pending");
  return response.data;
};

/**
 * Update PG Listing Approval Status
 * PUT /admin/listings/:id/status
 */
export const updateListingStatus = async (id, statusAction) => {
  const response = await api.put(`/admin/listings/${id}/status`, {
    status: statusAction,
  });
  return response.data;
};