// src/api/userApi.js
// ADMIN-only user management. All requests include the JWT via axiosClient interceptor.
import axiosClient from "./axiosClient";

/** Fetch every user account (ADMIN only). */
export const getUsers = () =>
  axiosClient.get("/admin/users").then((r) => r.data);

/** Fetch a single user account by ID (ADMIN only). */
export const getUser = (id) =>
  axiosClient.get(`/admin/users/${id}`).then((r) => r.data);

/**
 * Update a user's account details, including role (ADMIN only).
 * @param {number} id - user ID
 * @param {{ fullName, email, phone, role }} data
 */
export const updateUser = (id, data) =>
  axiosClient.put(`/admin/users/${id}`, data).then((r) => r.data);

/** Delete a user account permanently (ADMIN only). */
export const deleteUser = (id) => axiosClient.delete(`/admin/users/${id}`);
