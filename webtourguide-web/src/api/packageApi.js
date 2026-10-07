import axiosClient from "./axiosClient";

// includeInactive is only honoured by the backend for ADMIN/STAFF callers.
// `sort` selects the backend sorting strategy: "price-asc" | "price-desc" | "newest" | "duration"
export const getPackages = ({ includeInactive = false, sort = "" } = {}) => {
  const params = {};
  if (includeInactive) params.includeInactive = true;
  if (sort) params.sort = sort;
  return axiosClient.get("/packages", { params }).then((r) => r.data);
};

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
