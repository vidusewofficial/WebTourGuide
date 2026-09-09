import axiosClient from "./axiosClient";

export const getPackages = () =>
  axiosClient.get("/packages").then((r) => r.data);

export const getPackage = (id) =>
  axiosClient.get(`/packages/${id}`).then((r) => r.data);

export const getPackagesByDestination = (destinationId) =>
  axiosClient.get(`/packages/destination/${destinationId}`).then((r) => r.data);

export const comparePackages = (ids) =>
  axiosClient.get("/packages/compare", { params: { ids } }).then((r) => r.data);

export const searchPackages = (keyword) =>
  axiosClient.get("/packages/search", { params: { keyword } }).then((r) => r.data);

export const createPackage = (data) =>
  axiosClient.post("/packages", data).then((r) => r.data);

export const updatePackage = (id, data) =>
  axiosClient.put(`/packages/${id}`, data).then((r) => r.data);

export const deletePackage = (id) =>
  axiosClient.delete(`/packages/${id}`);
