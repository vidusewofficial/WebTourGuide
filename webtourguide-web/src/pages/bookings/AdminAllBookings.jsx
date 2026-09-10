import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getAllBookings,
  confirmBooking,
  completeBooking,
  cancelBooking,
  rescheduleBooking,
} from "../../api/bookingApi";

const STATUS_META = {
  PENDING:     { label: "Pending",     bg: "#fff3e8", color: "#d86816", border: "#f5cba7" },
  CONFIRMED:   { label: "Confirmed",   bg: "#e6f7ed", color: "#0d8a4f", border: "#a9dfbf" },
  CANCELLED:   { label: "Cancelled",   bg: "#fdecea", color: "#c0392b", border: "#f1948a" },
  COMPLETED:   { label: "Completed",   bg: "#e8f0fe", color: "#144a9e", border: "#aec6f5" },
  RESCHEDULED: { label: "Rescheduled", bg: "#f3e8ff", color: "#6c3483", border: "#c39bd3" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, bg: "#f0f0f0", color: "#555", border: "#ccc" };
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 14px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.4px",
      textTransform: "uppercase",
      background: meta.bg,
      color: meta.color,
      border: `1px solid ${meta.border}`,
    }}>
      {meta.label}
    </span>
  );
}

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
      setError("Could not load bookings. Please check that the backend is running.");
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Banner */}
      <div className="destinations-hero">
        <div className="destinations-hero-overlay">
          <div className="container text-center">
            <h1 className="destinations-hero-title">All Bookings (Admin)</h1>
            <p className="destinations-hero-subtitle">
              Manage and oversee all tourist bookings across the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Bookings Content */}
      <section className="layout_padding" style={{ backgroundColor: "#fbfbfb" }}>
        <div className="container">
          
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0">Booking Management</h2>
              <p className="text-muted mt-1">
                Showing {filtered.length} {filter === "ALL" ? "total" : filter.toLowerCase()} booking{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            
            {/* Status Filter Buttons */}
            <div className="d-flex flex-wrap mt-3 mt-md-0" style={{ gap: 8 }}>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={filter === s ? "btn-nav-custom" : "btn-outline-custom"}
                  style={{ padding: "6px 14px", fontSize: 13, border: filter === s ? "none" : undefined }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {actionError && (
            <div className="alert alert-danger mb-4" role="alert">
              {actionError}
            </div>
          )}

          {loading ? (
             <div className="text-center my-5">
               <div className="spinner-border text-primary" role="status">
                 <span className="sr-only">Loading...</span>
               </div>
               <p className="mt-3 text-muted">Loading all bookings...</p>
             </div>
          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: 600 }}>
              <p>{error}</p>
              <button onClick={refresh} className="btn-nav-custom mt-2">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center my-5 py-5 bg-white rounded shadow-sm">
              <img src="/images/earth.png" alt="No bookings" style={{ width: 64, opacity: 0.4, marginBottom: 16 }} />
              <h4 className="text-dark">No bookings found</h4>
              <p className="text-muted mb-4">No bookings match the current "{filter}" filter.</p>
              {filter !== "ALL" && (
                <button onClick={() => setFilter("ALL")} className="btn-outline-custom">View All</button>
              )}
            </div>
          ) : (
            <div className="compare-table-container">
              <table className="package-compare-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tourist</th>
                    <th>Package / Guide</th>
                    <th>Date & Pax</th>
                    <th>Status</th>
                    <th>Total (LKR)</th>
                    <th style={{ minWidth: 200 }}>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 600, color: "#144a9e" }}>#{b.id}</td>
                      <td>
                        <strong>{b.touristName}</strong>
                      </td>
                      <td>
                        <div style={{ color: "#01122a", fontWeight: 600, marginBottom: 4 }}>
                          {b.packageTitle || "—"}
                        </div>
                        <div style={{ fontSize: 13, color: "#777" }}>
                           Guide: {b.guideName || <span style={{ fontStyle: "italic", opacity: 0.6 }}>Unassigned</span>}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.bookingDate}</div>
                        <div style={{ fontSize: 13, color: "#777" }}>👥 {b.participants} pax</div>
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td style={{ fontWeight: 700, color: "#0d8a4f" }}>
                         {b.totalPrice != null ? Number(b.totalPrice).toLocaleString() : "—"}
                      </td>
                      
                      {/* Actions Column */}
                      <td>
                        {b.status !== "CANCELLED" && b.status !== "COMPLETED" ? (
                           <div className="d-flex flex-wrap gap-2" style={{ gap: 6 }}>
                             {(b.status === "PENDING" || b.status === "RESCHEDULED") && (
                               <button 
                                  onClick={() => handleAction(confirmBooking, b.id)}
                                  className="btn btn-sm btn-success" 
                                  style={{ borderRadius: 20, fontWeight: 600, fontSize: 12 }}
                               >
                                 Confirm
                               </button>
                             )}
                             
                             {b.status === "CONFIRMED" && (
                               <button 
                                  onClick={() => handleAction(completeBooking, b.id)}
                                  className="btn btn-sm btn-primary"
                                  style={{ borderRadius: 20, fontWeight: 600, fontSize: 12, backgroundColor: "#144a9e", borderColor: "#144a9e" }}
                               >
                                 Complete
                               </button>
                             )}

                             {reschedulingId === b.id ? (
                               <div className="d-flex flex-column gap-1 w-100 mt-1" style={{ gap: 4 }}>
                                 <input
                                   type="date"
                                   value={newDate}
                                   min={new Date().toISOString().split("T")[0]}
                                   onChange={(e) => setNewDate(e.target.value)}
                                   className="form-control form-control-sm rounded"
                                 />
                                 <div className="d-flex gap-1" style={{ gap: 4 }}>
                                   <button 
                                      onClick={() => handleReschedule(b.id)}
                                      className="btn btn-sm text-white flex-grow-1"
                                      style={{ backgroundColor: "#6c3483", borderRadius: 20, fontSize: 11, fontWeight: 600 }}
                                   >Save</button>
                                   <button 
                                      onClick={() => { setReschedulingId(null); setNewDate(""); }}
                                      className="btn btn-sm btn-light"
                                      style={{ borderRadius: 20, fontSize: 11, fontWeight: 600 }}
                                   >Cancel</button>
                                 </div>
                               </div>
                             ) : (
                               <>
                                 <button 
                                    onClick={() => { setReschedulingId(b.id); setNewDate(""); }}
                                    className="btn btn-sm text-white"
                                    style={{ backgroundColor: "#6c3483", borderRadius: 20, fontWeight: 600, fontSize: 12 }}
                                 >
                                   Reschedule
                                 </button>
                                 <button 
                                    onClick={() => handleAction((id) => cancelBooking(id), b.id)}
                                    className="btn btn-sm btn-outline-danger"
                                    style={{ borderRadius: 20, fontWeight: 600, fontSize: 12 }}
                                 >
                                   Cancel
                                 </button>
                               </>
                             )}
                           </div>
                        ) : (
                           <span className="text-muted" style={{ fontStyle: "italic", fontSize: 13 }}>
                             No actions available
                           </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
