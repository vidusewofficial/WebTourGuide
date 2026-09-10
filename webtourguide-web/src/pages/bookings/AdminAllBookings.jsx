import { useEffect, useState } from "react";
import {
  getAllBookings,
  confirmBooking,
  completeBooking,
  cancelBooking,
  rescheduleBooking,
} from "../../api/bookingApi";

const STATUS_COLORS = {
  PENDING: "#f39c12",
  CONFIRMED: "#27ae60",
  CANCELLED: "#e74c3c",
  COMPLETED: "#2980b9",
  RESCHEDULED: "#8e44ad",
};

export default function AdminAllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [actionError, setActionError] = useState("");
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch {
      setError("Could not load bookings. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleAction(action, id) {
    setActionError("");
    try {
      await action(id);
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.error || "Action failed. Please try again.");
    }
  }

  async function handleReschedule(id) {
    if (!newDate) return;
    setActionError("");
    try {
      await rescheduleBooking(id, newDate);
      setReschedulingId(null);
      setNewDate("");
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.error || "Reschedule failed.");
    }
  }

  const statuses = ["ALL", "PENDING", "CONFIRMED", "RESCHEDULED", "COMPLETED", "CANCELLED"];
  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return (
    <div style={{ textAlign: "center", padding: 60, fontSize: 18, color: "#888" }}>
      Loading all bookings...
    </div>
  );
  if (error) return (
    <div style={{ textAlign: "center", padding: 60, color: "#c0392b" }}>{error}</div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0 }}>All Bookings — Admin Management</h2>
        <span style={{ color: "#888", fontSize: 14 }}>
          {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {actionError && (
        <div style={{ background: "#fff0f0", border: "1px solid #ffb3b3", color: "#c0392b", padding: "10px 14px", borderRadius: 6, marginBottom: 16 }}>
          {actionError}
        </div>
      )}

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: filter === s ? (STATUS_COLORS[s] || "#1a73e8") : "#eee",
              color: filter === s ? "#fff" : "#444",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
          No bookings found for this filter.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((b) => (
            <div key={b.id} style={{ border: "1px solid #e0e0e0", borderRadius: 10, padding: "18px 22px", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>
                    #{b.id} — {b.touristName}
                  </span>
                  <span style={{ color: "#888", fontSize: 13, marginLeft: 10 }}>
                    {b.packageTitle || "No package"}
                    {b.guideName ? ` · Guide: ${b.guideName}` : ""}
                  </span>
                </div>
                <span style={{ background: STATUS_COLORS[b.status] || "#888", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {b.status}
                </span>
              </div>

              {/* Details */}
              <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#555", flexWrap: "wrap", marginBottom: 14 }}>
                <span>📅 {b.bookingDate}</span>
                <span>👥 {b.participants} participant{b.participants !== 1 ? "s" : ""}</span>
                <span style={{ fontWeight: 600 }}>LKR {b.totalPrice?.toFixed(2) ?? "—"}</span>
              </div>

              {/* Admin action buttons */}
              {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {b.status === "PENDING" || b.status === "RESCHEDULED" ? (
                    <button
                      onClick={() => handleAction(confirmBooking, b.id)}
                      style={{ padding: "7px 14px", background: "#27ae60", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                    >
                      ✓ Confirm
                    </button>
                  ) : null}

                  {b.status === "CONFIRMED" ? (
                    <button
                      onClick={() => handleAction(completeBooking, b.id)}
                      style={{ padding: "7px 14px", background: "#2980b9", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                    >
                      ✓ Mark Complete
                    </button>
                  ) : null}

                  {reschedulingId === b.id ? (
                    <>
                      <input
                        type="date"
                        value={newDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setNewDate(e.target.value)}
                        style={{ padding: "7px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 13 }}
                      />
                      <button
                        onClick={() => handleReschedule(b.id)}
                        style={{ padding: "7px 14px", background: "#8e44ad", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                      >
                        Save Date
                      </button>
                      <button
                        onClick={() => { setReschedulingId(null); setNewDate(""); }}
                        style={{ padding: "7px 12px", background: "#eee", color: "#333", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setReschedulingId(b.id); setNewDate(""); }}
                      style={{ padding: "7px 14px", background: "#8e44ad", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                    >
                      Reschedule
                    </button>
                  )}

                  <button
                    onClick={() => handleAction((id) => cancelBooking(id), b.id)}
                    style={{ padding: "7px 14px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
