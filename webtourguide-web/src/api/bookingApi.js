import axiosClient from "./axiosClient";

export const createBooking = (data) => axiosClient.post("/bookings", data).then((r) => r.data);
