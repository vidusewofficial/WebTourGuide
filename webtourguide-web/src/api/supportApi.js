import axiosClient from "./axiosClient";

export const createTicket = (data) => axiosClient.post("/support/tickets", data).then((r) => r.data);
export const getMyTickets = () => axiosClient.get("/support/tickets/my").then((r) => r.data);
export const getTicket = (id) => axiosClient.get(`/support/tickets/${id}`).then((r) => r.data);
export const getAllTickets = (status) =>
  axiosClient.get("/support/tickets", { params: status ? { status } : {} }).then((r) => r.data);
export const updateTicketStatus = (id, status) =>
  axiosClient.patch(`/support/tickets/${id}/status`, { status }).then((r) => r.data);
