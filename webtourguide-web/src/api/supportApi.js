import axiosClient from "./axiosClient";

/** Submits a new support ticket for the logged-in tourist. */
export const createTicket = (data) => axiosClient.post("/support/tickets", data).then((r) => r.data);
/** Lists support tickets raised by the logged-in tourist. */
export const getMyTickets = () => axiosClient.get("/support/tickets/my").then((r) => r.data);
/** Fetches a single ticket by id (owner, staff, or admin only). */
export const getTicket = (id) => axiosClient.get(`/support/tickets/${id}`).then((r) => r.data);
/** Lists all tickets, optionally filtered by status (staff/admin only). */
export const getAllTickets = (status) =>
  axiosClient.get("/support/tickets", { params: status ? { status } : {} }).then((r) => r.data);
/** Advances a ticket to a new status (staff/admin only). */
export const updateTicketStatus = (id, status) =>
  axiosClient.patch(`/support/tickets/${id}/status`, { status }).then((r) => r.data);
