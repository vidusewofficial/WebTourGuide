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
 * Fetch guides ranked best-first by a backend ranking strategy (public, Strategy Pattern).
 * @param {"rating"|"experience"|"languages"} by - which ranking strategy to use
 * @param {boolean} [availableOnly] - only include guides marked available
 */
export const getRankedGuides = (by, availableOnly = false) =>
  axiosClient.get("/guides/ranked", { params: { by, availableOnly } }).then((r) => r.data);

/**
 * Search guides by spoken language (public).
 * @param {string} language - e.g. "Tamil", "Sinhala"
 */
export const searchGuidesByLanguage = (language) =>
  axiosClient.get("/guides/search", { params: { language } }).then((r) => r.data);

/**
 * Search guides by operating area/destination (public).
 * @param {string} location - e.g. "Sigiriya", "Kandy"
 */
export const searchGuidesByLocation = (location) =>
  axiosClient.get("/guides/search-location", { params: { location } }).then((r) => r.data);

/**
 * Fetch TOUR_GUIDE-role users who don't have a guide profile yet
 * (ADMIN / STAFF only) — used to populate the "link user" picker.
 */
export const getEligibleGuideUsers = () =>
  axiosClient.get("/guides/eligible-users").then((r) => r.data);

/**
 * Create a new guide profile linking an existing TOUR_GUIDE user (ADMIN / STAFF only).
 * @param {{ userId, languages, skills, certifications, location, yearsExperience }} data
 */
export const createGuide = (data) =>
  axiosClient.post("/guides", data).then((r) => r.data);

/**
 * Create a brand-new guide account — a login (email/password) plus its guide
 * profile — in one step (ADMIN / STAFF only). The guide can log in right away.
 * @param {{ fullName, email, password, phone, languages, skills, certifications, location, yearsExperience }} data
 */
export const registerGuide = (data) =>
  axiosClient.post("/guides/register", data).then((r) => r.data);

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