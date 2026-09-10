import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking, rescheduleBooking } from "../../api/bookingApi";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  function refresh() { getMyBookings().then(setBookings); }
  useEffect(refresh, []);

  async function handleCancel(id) {
    await cancelBooking(id);
    refresh();
  }

  async function handleReschedule(id) {
    const newDate = prompt("New date (YYYY-MM-DD):");
    if (!newDate) return;
    await rescheduleBooking(id, newDate);
    refresh();
  }

  return (
    <div className="page">
      <h1>My Bookings</h1>
      <table>
        <thead>
          <tr><th>Package</th><th>Date</th><th>Participants</th><th>Status</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  );
}
