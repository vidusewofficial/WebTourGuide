// src/api/guideApplicationApi.js
// "Apply to become a guide" workflow. All requests include the JWT via axiosClient interceptor.
import axiosClient from "./axiosClient";

/**
 * Submit a new application to become a guide (must be logged in as TOURIST).
 * @param {{ languages, skills, certifications, location, yearsExperience, message }} data
 */
export const applyToBeGuide = (data) =>
  axiosClient.post("/guide-applications", data).then((r) => r.data);

/** Fetch the current user's own applications, most recent first. */
export const getMyApplications = () =>
  axiosClient.get("/guide-applications/my").then((r) => r.data);

/**
 * List every application (ADMIN / STAFF only).
 * @param {string} [status] - PENDING | APPROVED | REJECTED
 */
export const getAllApplications = (status) =>
  axiosClient
    .get("/guide-applications", { params: status ? { status } : {} })
    .then((r) => r.data);

/**
 * Approve an application: promotes the applicant to TOUR_GUIDE, sets their
 * login password, and creates their guide profile (ADMIN only).
 * @param {number} id - application ID
 * @param {string} password - login password to set for the new guide
 */
export const approveApplication = (id, password) =>
  axiosClient.post(`/guide-applications/${id}/approve`, { password }).then((r) => r.data);

/**
 * Reject an application, optionally with a reviewer note (ADMIN / STAFF only).
 * @param {number} id - application ID
 * @param {string} [reviewNote]
 */
export const rejectApplication = (id, reviewNote) =>
  axiosClient
    .post(`/guide-applications/${id}/reject`, reviewNote ? { reviewNote } : {})
    .then((r) => r.data);
