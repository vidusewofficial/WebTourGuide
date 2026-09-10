import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/bookingApi";

export default function AdminAllBookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { getAllBookings().then(setBookings); }, []);
}
