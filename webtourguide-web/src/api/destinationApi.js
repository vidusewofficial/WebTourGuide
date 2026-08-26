import axiosClient from "./axiosClient";

export const getDestinations = () =>
  axiosClient.get("/destinations").then((r) => r.data);

export const getDestinationById = (id) =>
  axiosClient.get(`/destinations/${id}`).then((r) => r.data);

export const searchDestinations = (keyword) =>
  axiosClient.get("/destinations/search", { params: { keyword } }).then((r) => r.data);

export const filterDestinations = (category) =>
  axiosClient.get("/destinations/filter", { params: { category } }).then((r) => r.data);

export const createDestination = (data) =>
  axiosClient.post("/destinations", data).then((r) => r.data);

export const updateDestination = (id, data) =>
  axiosClient.put(`/destinations/${id}`, data).then((r) => r.data);

export const deleteDestination = (id) =>
  axiosClient.delete(`/destinations/${id}`).then((r) => r.data);
