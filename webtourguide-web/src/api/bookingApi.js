import axiosClient from "./axiosClient";

export const createBooking = (data) => axiosClient.post("/bookings", data).then((r) => r.data);
export const getMyBookings = () => axiosClient.get("/bookings/my").then((r) => r.data);
export const getAllBookings = () => axiosClient.get("/bookings").then((r) => r.data);
export const cancelBooking = (id) => axiosClient.patch(`/bookings/${id}/cancel`).then((r) => r.data);
export const rescheduleBooking = (id, newBookingDate) =>
  axiosClient.patch(`/bookings/${id}/reschedule`, { newBookingDate }).then((r) => r.data);
export const getBookingStatus = (id) => axiosClient.get(`/bookings/${id}/status`).then((r) => r.data);
