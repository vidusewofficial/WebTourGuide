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
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.touristName}</td>
              <td>{b.packageTitle}</td>
              <td>{b.guideName || "—"}</td>
              <td>{b.bookingDate}</td>
              <td>{b.status}</td>
              <td>{b.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
