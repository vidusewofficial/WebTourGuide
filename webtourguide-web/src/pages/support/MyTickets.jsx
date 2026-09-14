import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getMyTickets } from "../../api/supportApi";

const STATUS_META = {
  OPEN:        { label: "Open",        bg: "#fff3e8", color: "#d86816", border: "#f5cba7" },
  IN_PROGRESS: { label: "In Progress", bg: "#f3e8ff", color: "#6c3483", border: "#c39bd3" },
  RESOLVED:    { label: "Resolved",    bg: "#e6f7ed", color: "#0d8a4f", border: "#a9dfbf" },
  CLOSED:      { label: "Closed",      bg: "#f0f0f0", color: "#555555", border: "#cccccc" },
};

const TYPE_LABELS = {
  INQUIRY: "General Inquiry",
  COMPLAINT: "Complaint",
  CANCELLATION_REQUEST: "Cancellation Request",
  RESCHEDULE_REQUEST: "Reschedule Request",
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

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await getMyTickets();
      setTickets(data);
    } catch {
      setError("Could not load your support history. Please check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

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
            <h1 className="destinations-hero-title">My Support History</h1>
            <p className="destinations-hero-subtitle">
              Track the status of every inquiry, complaint, and request you've raised.
            </p>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <section className="layout_padding" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container">

          <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0">Your Requests</h2>
              <p className="text-muted mt-1">All support requests you have raised are listed below.</p>
            </div>
            <Link to="/support/new" className="btn-nav-custom mt-3 mt-md-0">
              + New Request
            </Link>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading your support history...</p>
            </div>

          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: 600 }}>
              <p>{error}</p>
              <button onClick={refresh} className="btn-nav-custom mt-2">Retry</button>
            </div>

          ) : tickets.length === 0 ? (
            <div className="text-center my-5 py-5 bg-white rounded shadow-sm">
              <img src="/images/earth.png" alt="No requests" style={{ width: 64, opacity: 0.4, marginBottom: 16 }} />
              <h4 className="text-dark">No support requests yet</h4>
              <p className="text-muted mb-4">Need help with a booking or trip? Reach out to our support team.</p>
              <Link to="/support/new" className="btn-nav-custom">Raise a Request →</Link>
            </div>

          ) : (
            <div className="row">
              {tickets.map((t) => (
                <motion.div
                  className="col-md-6 col-lg-4 mb-4"
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="destination-card"
                    style={{ borderTop: `4px solid ${STATUS_META[t.status]?.color || "#f07b26"}` }}
                  >
                    <div className="destination-card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <StatusBadge status={t.status} />
                        <span className="text-muted" style={{ fontSize: 12 }}>#{t.id}</span>
                      </div>

                      <h5 className="font-weight-bold mb-1" style={{ color: "#01122a" }}>
                        {t.subject}
                      </h5>
                      <p className="text-muted mb-2" style={{ fontSize: 13 }}>
                        {TYPE_LABELS[t.type] || t.type}
                      </p>

                      <div className="row text-center mt-3 mb-3 pt-3" style={{ borderTop: "1px solid #f0f0f0" }}>
                        <div className="col-6">
                          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Raised</div>
                          <div style={{ fontWeight: 700, color: "#01122a", fontSize: 13 }}>
                            {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
                          </div>
                        </div>
                        <div className="col-6">
                          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>Handled By</div>
                          <div style={{ fontWeight: 700, color: "#01122a", fontSize: 13 }}>
                            {t.handledByName || "Unassigned"}
                          </div>
                        </div>
                      </div>
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
