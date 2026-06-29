import api from "./axios";

/**
 * ============================
 * AMENITY API
 * ============================
 */

/**
 * Get All Amenities
 * GET /amenities
 */
export const getAllAmenities = async () => {
  const response = await api.get("/amenities");
  return response.data;
};

/**
 * Get Amenity By ID
 * GET /amenities/:id
 */
export const getAmenityById = async (id) => {
  const response = await api.get(`/amenities/${id}`);
  return response.data;
};

/**
 * Create Amenity (Admin/Owner)
 * POST /amenities
 */
export const createAmenity = async (data) => {
  const response = await api.post("/amenities", data);
  return response.data;
};

/**
 * Update Amenity
 * PUT /amenities/:id
 */
export const updateAmenity = async (id, data) => {
  const response = await api.put(
    `/amenities/${id}`,
    data
  );
  return response.data;
};

/**
 * Delete Amenity
 * DELETE /amenities/:id
 */
export const deleteAmenity = async (id) => {
  const response = await api.delete(`/amenities/${id}`);
  return response.data;
};

/**
 * Assign Amenities to PG
 * POST /pgs/:pgId/amenities
 */
export const assignAmenitiesToPG = async (pgId, data) => {
  const response = await api.post(
    `/pgs/${pgId}/amenities`,
    data
  );

  return response.data;
};

/**
 * Remove Amenity from PG
 * DELETE /pgs/:pgId/amenities/:amenityId
 */
export const removeAmenityFromPG = async (
  pgId,
  amenityId
) => {
  const response = await api.delete(
    `/pgs/${pgId}/amenities/${amenityId}`
  );

  return response.data;
};