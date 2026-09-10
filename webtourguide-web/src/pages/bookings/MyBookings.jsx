import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking, rescheduleBooking } from "../../api/bookingApi";

const STATUS_COLORS = {
  PENDING: "#f39c12",
  CONFIRMED: "#27ae60",
  CANCELLED: "#e74c3c",
  COMPLETED: "#2980b9",
  RESCHEDULED: "#8e44ad",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [actionError, setActionError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      setError("Could not load bookings. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleCancel(id) {
    setActionError("");
    try {
      await cancelBooking(id);
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.error || "Could not cancel booking.");
    }
  }

  async function handleRescheduleSubmit(id) {
    if (!newDate) return;
    setActionError("");
    try {
      await rescheduleBooking(id, newDate);
      setReschedulingId(null);
      setNewDate("");
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.error || "Could not reschedule booking.");
    }
  }

  const canAct = (status) => status === "PENDING" || status === "RESCHEDULED" || status === "CONFIRMED";

  if (loading) return <div style={{ textAlign: "center", padding: 60, fontSize: 18, color: "#888" }}>Loading your bookings...</div>;
  if (error) return <div style={{ textAlign: "center", padding: 60, color: "#c0392b", fontSize: 16 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: 24 }}>My Bookings</h2>

      {actionError && (
        <div style={{ background: "#fff0f0", border: "1px solid #ffb3b3", color: "#c0392b", padding: "10px 14px", borderRadius: 6, marginBottom: 18 }}>
          {actionError}
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#888", fontSize: 16 }}>
          <p>You have no bookings yet.</p>
          <a href="/bookings/new" style={{ color: "#1a73e8", fontWeight: 600 }}>Book your first tour →</a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {bookings.map((b) => (
            <div key={b.id} style={{ border: "1px solid #e0e0e0", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{b.packageTitle || "Tour Package"}</h3>
                  {b.guideName && <p style={{ margin: "4px 0 0", color: "#555", fontSize: 14 }}>Guide: {b.guideName}</p>}
                </div>
                <span style={{ background: STATUS_COLORS[b.status] || "#888", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {b.status}
                </span>
              </div>

              <div style={{ display: "flex", gap: 32, marginTop: 14, flexWrap: "wrap", fontSize: 14, color: "#444" }}>
                <span>📅 {b.bookingDate}</span>
                <span>👥 {b.participants} participant{b.participants !== 1 ? "s" : ""}</span>
                <span style={{ fontWeight: 600 }}>LKR {b.totalPrice?.toFixed(2) ?? "—"}</span>
              </div>

              {canAct(b.status) && (
                <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  {reschedulingId === b.id ? (
                    <>
                      <input
                        type="date"
                        value={newDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setNewDate(e.target.value)}
                        style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }}
                      />
                      <button
                        onClick={() => handleRescheduleSubmit(b.id)}
                        style={{ padding: "8px 16px", background: "#8e44ad", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
                      >
                        Confirm Date
                      </button>
                      <button
                        onClick={() => { setReschedulingId(null); setNewDate(""); }}
                        style={{ padding: "8px 14px", background: "#eee", color: "#333", border: "none", borderRadius: 6, cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setReschedulingId(b.id); setNewDate(""); }}
                        style={{ padding: "8px 16px", background: "#8e44ad", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(b.id)}
                        style={{ padding: "8px 16px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
