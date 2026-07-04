import api from "./axios";

/**
 * ============================
 * AMENITY API ENDPOINTS
 * ============================
 */

/**
 * Get All Available Amenities
 * GET /amenities
 */
export const getAllAmenities = async () => {
  const response = await api.get("/amenities");
  return response.data;
};

/**
 * Get Amenity Details By ID
 * GET /amenities/:id
 */
export const getAmenityById = async (id) => {
  const response = await api.get(`/amenities/${id}`);
  return response.data;
};

/**
 * Create New Amenity (Admin/Owner authorization required)
 * POST /amenities
 */
export const createAmenity = async (data) => {
  const response = await api.post("/amenities", data);
  return response.data;
};

/**
 * Update Existing Amenity Information
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
 * Delete Amenity from the System
 * DELETE /amenities/:id
 */
export const deleteAmenity = async (id) => {
  const response = await api.delete(`/amenities/${id}`);
  return response.data;
};

/**
 * Assign Amenities to a specific PG Profile
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
 * Remove an Amenity option from a specific PG Profile
 * DELETE /pgs/:pgId/amenities/:amenityId
 */
export const removeAmenityFromPG = async (pgId, amenityId) => {
  const response = await api.delete(
    `/pgs/${pgId}/amenities/${amenityId}`
  );

  return response.data;
};