// src/api/guideApi.js
// All requests automatically include the JWT from localStorage via axiosClient interceptor.
import axiosClient from "./axiosClient";

/** Fetch every guide profile (public). */
export const getGuides = () =>
  axiosClient.get("/guides").then((r) => r.data);

/** Fetch a single guide profile by ID (public). */
export const getGuide = (id) =>
  axiosClient.get(`/guides/${id}`).then((r) => r.data);

/** Fetch only guides whose isAvailable flag is true (public). */
export const getAvailableGuides = () =>
  axiosClient.get("/guides/available").then((r) => r.data);

/**
 * Search guides by spoken language (public).
 * @param {string} language - e.g. "Tamil", "Sinhala"
 */
export const searchGuidesByLanguage = (language) =>
  axiosClient.get("/guides/search", { params: { language } }).then((r) => r.data);

/**
 * Update a guide's profile fields (TOUR_GUIDE own / ADMIN).
 * @param {number} id - guide profile ID
 * @param {{ languages, skills, certifications, yearsExperience }} data
 */
export const updateGuideProfile = (id, data) =>
  axiosClient.put(`/guides/${id}`, data).then((r) => r.data);

/**
 * Toggle a guide's availability status (TOUR_GUIDE own / ADMIN).
 * @param {number} id - guide profile ID
 * @param {boolean} isAvailable
 */
export const updateGuideAvailability = (id, isAvailable) =>
  axiosClient.patch(`/guides/${id}/availability`, { isAvailable }).then((r) => r.data);

/**
 * Remove a guide listing (ADMIN only).
 * @param {number} id - guide profile ID
 */
export const deleteGuide = (id) => axiosClient.delete(`/guides/${id}`);