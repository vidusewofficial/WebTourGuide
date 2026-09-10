import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/bookingApi";

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

  useEffect(() => {
    getAllBookings()
      .then(setBookings)
      .catch(() => setError("Could not load bookings. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const statuses = ["ALL", "PENDING", "CONFIRMED", "RESCHEDULED", "COMPLETED", "CANCELLED"];
  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <div style={{ textAlign: "center", padding: 60, fontSize: 18, color: "#888" }}>Loading all bookings...</div>;
  if (error) return <div style={{ textAlign: "center", padding: 60, color: "#c0392b" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0 }}>All Bookings — Admin Oversight</h2>
        <span style={{ color: "#888", fontSize: 14 }}>{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: filter === s ? (STATUS_COLORS[s] || "#1a73e8") : "#eee",
              color: filter === s ? "#fff" : "#444",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#888" }}>No bookings found for this filter.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                {["ID", "Tourist", "Package", "Guide", "Date", "Participants", "Status", "Total (LKR)"].map((h) => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "#333", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #e9ecef", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "10px 14px", color: "#888" }}>#{b.id}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{b.touristName}</td>
                  <td style={{ padding: "10px 14px" }}>{b.packageTitle || "—"}</td>
                  <td style={{ padding: "10px 14px" }}>{b.guideName || <span style={{ color: "#aaa" }}>No guide</span>}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>{b.bookingDate}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>{b.participants}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ background: STATUS_COLORS[b.status] || "#888", color: "#fff", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{b.totalPrice?.toFixed(2) ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
