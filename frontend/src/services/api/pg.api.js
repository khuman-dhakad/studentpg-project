import api from "./axios";

/**
 * ============================
 * PG API
 * ============================
 */

/**
 * Get All PGs
 * GET /pgs
 */
export const getAllPGs = async () => {
  const response = await api.get("/pgs");
  return response.data;
};

/**
 * Get PG By Id
 * GET /pgs/:id
 */
export const getPGById = async (id) => {
  const response = await api.get(`/pgs/${id}`);
  return response.data;
};

/**
 * Create PG
 * POST /pgs
 */
export const createPG = async (data) => {
  const response = await api.post("/pgs", data);
  return response.data;
};

/**
 * Update PG
 * PUT /pgs/:id
 */
export const updatePG = async (id, data) => {
  const response = await api.put(`/pgs/${id}`, data);
  return response.data;
};

/**
 * Delete PG
 * DELETE /pgs/:id
 */
export const deletePG = async (id) => {
  const response = await api.delete(`/pgs/${id}`);
  return response.data;
};


/**
 * Owner PGs
 * GET /pgs/owner/:ownerId
 */
export const getOwnerPGs = async (ownerId) => {
  const response = await api.get(`/pgs/owner/${ownerId}`);
  return response.data;
};

/**
 * Search PGs
 * GET /pgs/filter
 */
export const searchPGs = async (params) => {
  const response = await api.get("/pgs/filter", {
    params,
  });

  return response.data;
};

/**
 * Featured PGs
 * GET /pgs/featured
 */
export const getFeaturedPGs = async () => {
  const response = await api.get("/pgs/featured");
  return response.data;
};

/**
 * Nearby PGs
 * GET /pgs/nearby
 */
export const getNearbyPGs = async (params) => {
  const response = await api.get("/pgs/nearby", {
    params,
  });

  return response.data;
};

/**
 * Upload Images
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
 * Delete Image
 * DELETE /pgs/:id/images/:imageId
 */
export const deletePGImage = async (pgId, imageId) => {
  const response = await api.delete(
    `/pgs/${pgId}/images/${imageId}`
  );

  return response.data;
};