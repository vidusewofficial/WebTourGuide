import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getMyBookings, cancelBooking, rescheduleBooking } from "../../api/bookingApi";

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

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      setError("Could not load bookings. Please check that the backend is running.");
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

  const canAct = (status) =>
    status === "PENDING" || status === "CONFIRMED" || status === "RESCHEDULED";

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
            <h1 className="destinations-hero-title">My Bookings</h1>
            <p className="destinations-hero-subtitle">
              View, reschedule, or cancel your tour bookings.
            </p>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <section className="layout_padding" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container">

          {/* Section header */}
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0">Your Bookings</h2>
              <p className="text-muted mt-1">All bookings you have made are listed below.</p>
            </div>
            <Link to="/bookings/new" className="btn-nav-custom mt-3 mt-md-0">
              + Book a New Tour
            </Link>
          </div>

          {/* Action error */}
          {actionError && (
            <div className="alert alert-danger mb-4" role="alert">
              {actionError}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading your bookings...</p>
            </div>

          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: 600 }}>
              <p>{error}</p>
              <button onClick={refresh} className="btn-nav-custom mt-2">Retry</button>
            </div>

          ) : bookings.length === 0 ? (
            <div className="text-center my-5 py-5 bg-white rounded shadow-sm">
              <img src="/images/earth.png" alt="No bookings" style={{ width: 64, opacity: 0.4, marginBottom: 16 }} />
              <h4 className="text-dark">No bookings yet</h4>
              <p className="text-muted mb-4">You haven't made any bookings. Start by choosing a package!</p>
              <Link to="/bookings/new" className="btn-nav-custom">Book Your First Tour →</Link>
            </div>

          ) : (
            <div className="row">
              {bookings.map((b) => (
                <motion.div
                  className="col-md-6 col-lg-4 mb-4"
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="destination-card"
                    style={{ borderTop: `4px solid ${STATUS_META[b.status]?.color || "#f07b26"}` }}
                  >
                    {/* Card body */}
                    <div className="destination-card-body">

                      {/* Status + Booking ID */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <StatusBadge status={b.status} />
                        <span className="text-muted" style={{ fontSize: 12 }}>#{b.id}</span>
                      </div>

                      {/* Package title */}
                      <h5 className="font-weight-bold mb-1" style={{ color: "#01122a" }}>
                        {b.packageTitle || "Tour Package"}
                      </h5>

                      {/* Guide */}
                      {b.guideName && (
                        <p className="destination-card-location mb-2">
                          <img src="/images/earth.png" alt="" style={{ width: 14, height: 14 }} />
                          Guide: {b.guideName}
                        </p>
                      )}

                      {/* Details grid */}
                      <div className="row text-center mt-3 mb-3 pt-3" style={{ borderTop: "1px solid #f0f0f0" }}>
                        <div className="col-4">
                          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</div>
                          <div style={{ fontWeight: 700, color: "#01122a", fontSize: 13 }}>{b.bookingDate}</div>
                        </div>
                        <div className="col-4">
                          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>People</div>
                          <div style={{ fontWeight: 700, color: "#01122a", fontSize: 13 }}>👥 {b.participants}</div>
                        </div>
                        <div className="col-4">
                          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total</div>
                          <div style={{ fontWeight: 700, color: "#0d8a4f", fontSize: 13 }}>
                            LKR {b.totalPrice != null ? Number(b.totalPrice).toLocaleString() : "—"}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {canAct(b.status) && (
                        <div className="mt-auto pt-2" style={{ borderTop: "1px solid #f0f0f0" }}>
                          {reschedulingId === b.id ? (
                            <div>
                              <input
                                type="date"
                                value={newDate}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="tripbiz-input mb-2"
                              />
                              <div className="d-flex" style={{ gap: 8 }}>
                                <button
                                  onClick={() => handleRescheduleSubmit(b.id)}
                                  className="btn-nav-custom flex-grow-1"
                                  style={{ fontSize: 13, padding: "8px 12px" }}
                                >
                                  Save Date
                                </button>
                                <button
                                  onClick={() => { setReschedulingId(null); setNewDate(""); }}
                                  className="btn-outline-custom"
                                  style={{ fontSize: 13, padding: "8px 12px" }}
                                >
                                  Back
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex" style={{ gap: 8 }}>
                              <button
                                onClick={() => { setReschedulingId(b.id); setNewDate(""); }}
                                className="btn-outline-custom flex-grow-1"
                                style={{ fontSize: 13, padding: "8px 10px" }}
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancel(b.id)}
                                style={{
                                  flex: 1,
                                  fontSize: 13, padding: "8px 10px",
                                  borderRadius: 25, fontWeight: 600,
                                  border: "1px solid #c0392b",
                                  color: "#c0392b", background: "transparent", cursor: "pointer",
                                  transition: "all 0.3s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#c0392b"; e.currentTarget.style.color = "#fff"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c0392b"; }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
