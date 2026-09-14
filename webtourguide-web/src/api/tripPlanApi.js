/**
 * tripPlanApi.js
 * API functions for the Trip Planning module.
 * All calls go through axiosClient which attaches the Bearer token automatically.
 */
import axiosClient from "./axiosClient";

/**
 * Creates a new trip plan for the logged-in tourist.
 * @param {{ title: string, startDate?: string, endDate?: string }} data
 * @returns {Promise<TripPlanResponse>}
 */
export const createTripPlan = (data) =>
  axiosClient.post("/trip-plans", data).then((r) => r.data);

/**
 * Returns all trip plans belonging to the logged-in tourist.
 * @returns {Promise<TripPlanResponse[]>}
 */
export const getMyTripPlans = () =>
  axiosClient.get("/trip-plans/my").then((r) => r.data);

/**
 * Returns a single trip plan by ID.
 * Returns 403 if the plan does not belong to the caller.
 * @param {number} id
 * @returns {Promise<TripPlanResponse>}
 */
export const getTripPlan = (id) =>
  axiosClient.get(`/trip-plans/${id}`).then((r) => r.data);

/**
 * Replaces the title, dates, and full item list of an existing plan.
 * @param {number} id
 * @param {{ title?: string, startDate?: string, endDate?: string, items?: object[] }} data
 * @returns {Promise<TripPlanResponse>}
 */
export const updateTripPlan = (id, data) =>
  axiosClient.put(`/trip-plans/${id}`, data).then((r) => r.data);

/**
 * Permanently deletes a trip plan and all its items.
 * Returns 204 No Content on success.
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteTripPlan = (id) =>
  axiosClient.delete(`/trip-plans/${id}`);
