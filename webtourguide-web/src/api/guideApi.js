// src/api/guideApi.js
import axiosClient from "./axiosClient";

export const getGuides = () =>
  axiosClient.get("/guides").then((r) => r.data);

export const getGuide = (id) =>
  axiosClient.get(`/guides/${id}`).then((r) => r.data);

export const getAvailableGuides = () =>
  axiosClient.get("/guides/available").then((r) => r.data);

export const searchGuidesByLanguage = (language) =>
  axiosClient.get("/guides/search", { params: { language } }).then((r) => r.data);

export const updateGuideProfile = (id, data) =>
  axiosClient.put(`/guides/${id}`, data).then((r) => r.data);

export const updateGuideAvailability = (id, isAvailable) =>
  axiosClient.patch(`/guides/${id}/availability`, { isAvailable }).then((r) => r.data);

export const deleteGuide = (id) => axiosClient.delete(`/guides/${id}`);