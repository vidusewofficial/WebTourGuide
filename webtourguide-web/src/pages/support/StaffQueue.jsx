import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllTickets, updateTicketStatus } from "../../api/supportApi";

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

const NEXT_STATUS = { OPEN: "IN_PROGRESS", IN_PROGRESS: "RESOLVED", RESOLVED: "CLOSED" };

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

export default function StaffQueue() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTickets(statusFilter === "ALL" ? undefined : statusFilter);
      setTickets(data);
    } catch {
      setError("Could not load the support queue. Please check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [statusFilter]);

  async function handleAdvance(id, currentStatus) {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    setActionError("");
    try {
      await updateTicketStatus(id, next);
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.error || "Could not update ticket status.");
    }
  }

  const statuses = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

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
            <h1 className="destinations-hero-title">Support Queue</h1>
            <p className="destinations-hero-subtitle">
              Triage and resolve tourist inquiries, complaints, and requests.
            </p>
          </div>
        </div>
      </div>

      {/* Queue Content */}
      <section className="layout_padding" style={{ backgroundColor: "#fbfbfb" }}>
        <div className="container">

          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0">Ticket Management</h2>
              <p className="text-muted mt-1">
                Showing {tickets.length} {statusFilter === "ALL" ? "total" : statusFilter.toLowerCase().replace("_", " ")} ticket{tickets.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="d-flex flex-wrap mt-3 mt-md-0" style={{ gap: 8 }}>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={statusFilter === s ? "btn-nav-custom" : "btn-outline-custom"}
                  style={{ padding: "6px 14px", fontSize: 13, border: statusFilter === s ? "none" : undefined }}
                >
                  {s.replace("_", " ")}
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
              <p className="mt-3 text-muted">Loading the support queue...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: 600 }}>
              <p>{error}</p>
              <button onClick={refresh} className="btn-nav-custom mt-2">Retry</button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center my-5 py-5 bg-white rounded shadow-sm">
              <img src="/images/earth.png" alt="No tickets" style={{ width: 64, opacity: 0.4, marginBottom: 16 }} />
              <h4 className="text-dark">No tickets found</h4>
              <p className="text-muted mb-4">No tickets match the current "{statusFilter}" filter.</p>
              {statusFilter !== "ALL" && (
                <button onClick={() => setStatusFilter("ALL")} className="btn-outline-custom">View All</button>
              )}
            </div>
          ) : (
            <div className="compare-table-container">
              <table className="package-compare-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Raised By</th>
                    <th>Type / Subject</th>
                    <th>Status</th>
                    <th>Handled By</th>
                    <th style={{ minWidth: 160 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600, color: "#144a9e" }}>#{t.id}</td>
                      <td>
                        <strong>{t.raisedByName}</strong>
                      </td>
                      <td>
                        <div style={{ color: "#01122a", fontWeight: 600, marginBottom: 4 }}>
                          {t.subject}
                        </div>
                        <div style={{ fontSize: 13, color: "#777" }}>
                          {TYPE_LABELS[t.type] || t.type}
                        </div>
                        {t.bookingSummary && (
                          <div style={{ fontSize: 12, color: "#144a9e", marginTop: 2 }}>
                            🔗 Booking {t.bookingSummary}
                            {t.type === "CANCELLATION_REQUEST" && t.status !== "RESOLVED" && t.status !== "CLOSED" && (
                              <span style={{ color: "#9a3412" }}> — resolving will cancel it</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                      <td>
                        {t.handledByName || <span style={{ fontStyle: "italic", opacity: 0.6 }}>Unassigned</span>}
                      </td>
                      <td>
                        {NEXT_STATUS[t.status] ? (
                          <button
                            onClick={() => handleAdvance(t.id, t.status)}
                            className="btn btn-sm btn-primary"
                            style={{ borderRadius: 20, fontWeight: 600, fontSize: 12, backgroundColor: "#144a9e", borderColor: "#144a9e" }}
                          >
                            Move to {NEXT_STATUS[t.status].replace("_", " ")}
                          </button>
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
