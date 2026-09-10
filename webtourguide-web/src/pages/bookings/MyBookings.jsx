import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking, rescheduleBooking } from "../../api/bookingApi";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  function refresh() { getMyBookings().then(setBookings); }
  useEffect(refresh, []);
}
