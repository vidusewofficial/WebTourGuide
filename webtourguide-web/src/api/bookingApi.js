import axiosClient from "./axiosClient";

export const createBooking = (data) => axiosClient.post("/bookings", data).then((r) => r.data);
export const getMyBookings = () => axiosClient.get("/bookings/my").then((r) => r.data);
