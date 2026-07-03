import api from "./axios";

/**
 * ============================
 * PROPERTY LISTINGS (PG) API
 * ============================
 */

/**
 * Get All Registered PGs
 * GET /student/pgs
 */
export const getAllPGs = async () => {
  const response = await api.get("/student/pgs"); // ✅ Connected to student route
  return response.data;
};

/**
 * Get Single PG Property Details By Id
 * GET /student/pgs/:id
 */
export const getPGById = async (id) => {
  const response = await api.get(`/student/pgs/${id}`); // ✅ Connected to student route
  return response.data;
};

/**
 * Create a New PG Property Listing
 * POST /pgs
 */
export const createPG = async (data) => {
  const response = await api.post("/pgs", data);
  return response.data;
};

/**
 * Update Existing PG Details
 * PUT /pgs/:id
 */
export const updatePG = async (id, data) => {
  const response = await api.put(`/pgs/${id}`, data);
  return response.data;
};

/**
 * Delete a PG Listing from the App
 * DELETE /pgs/:id
 */
export const deletePG = async (id) => {
  const response = await api.delete(`/pgs/${id}`);
  return response.data;
};

/**
 * Get All PG Properties Owned by a Specific Person
 * GET /pgs/owner/:ownerId
 */
export const getOwnerPGs = async (ownerId) => {
  const response = await api.get(`/pgs/owner/${ownerId}`);
  return response.data;
};

/**
 * Search and Filter through PG Listings
 * GET /student/pgs/filter
 */
export const searchPGs = async (params) => {
  const response = await api.get("/student/pgs/filter", { // ✅ Connected to filter route
    params,
  });
  return response.data;
};

/**
 * Get Featured Premium PGs for the Home Screen
 * GET /student/pgs/featured
 */
export const getFeaturedPGs = async () => {
  const response = await api.get("/student/pgs/featured"); // ✅ Connected to featured route
  return response.data;
};

/**
 * Find Nearby Properties using Location Parameters
 * GET /pgs/nearby
 */
export const getNearbyPGs = async (params) => {
  const response = await api.get("/pgs/nearby", {
    params,
  });
  return response.data;
};

/**
 * Upload Multiple Property Images to Server Storage
 * POST /pgs/:id/images
 */
export const uploadPGImages = async (id, files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post(
    `/pgs/${id}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/**
 * Delete a Specific Image from a PG Listing
 * DELETE /pgs/:id/images/:imageId
 */
export const deletePGImage = async (pgId, imageId) => {
  const response = await api.delete(
    `/pgs/${pgId}/images/${imageId}`
  );
  return response.data;
};