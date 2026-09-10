import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/bookingApi";

export default function AdminAllBookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { getAllBookings().then(setBookings); }, []);

  return (
    <div className="page">
      <h1>All Bookings (Oversight)</h1>
      <table>
        <thead>
          <tr><th>Tourist</th><th>Package</th><th>Guide</th><th>Date</th><th>Status</th><th>Total</th></tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  );
}
