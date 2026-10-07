import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllApplications, approveApplication, rejectApplication } from "../../api/guideApplicationApi";

const STATUS_META = {
  PENDING: { label: "Pending", bg: "#fff3e8", color: "#d86816", border: "#f5cba7" },
  APPROVED: { label: "Approved", bg: "#e6f7ed", color: "#0d8a4f", border: "#a9dfbf" },
  REJECTED: { label: "Rejected", bg: "#fdecea", color: "#c0392b", border: "#f1a9a0" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, bg: "#f0f0f0", color: "#555", border: "#ccc" };
  return (
    <span style={{
      display: "inline-block", padding: "4px 14px", borderRadius: 20,
      fontSize: 12, fontWeight: 700, letterSpacing: "0.4px", textTransform: "uppercase",
      background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
    }}>
      {meta.label}
    </span>
  );
}

export default function GuideApplications() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [approvingId, setApprovingId] = useState(null);
  const [password, setPassword] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllApplications(statusFilter === "ALL" ? undefined : statusFilter);
      setApplications(data);
    } catch (err) {
      console.error("Load applications error:", err);
      setError("Could not load guide applications. Please check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [statusFilter]);

  function openApprove(id) {
    setActionError("");
    setApprovingId(id);
    setPassword("");
  }

  function cancelApprove() {
    setApprovingId(null);
    setPassword("");
  }

  async function handleApprove(id) {
    if (!password || password.length < 6) {
      setActionError("Password must be at least 6 characters.");
      return;
    }
    setActionError("");
    setBusyId(id);
    try {
      const guide = await approveApplication(id, password);
      setApprovingId(null);
      setPassword("");
      refresh();
      if (guide?.id) {
        setTimeout(() => navigate(`/guides/${guide.id}`), 400);
      }
    } catch (err) {
      console.error("Approve error:", err);
      setActionError(err.response?.data?.message || err.response?.data?.error || "Failed to approve application.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id) {
    const reason = window.prompt("Optional: give a reason for rejecting this application.") || "";
    setActionError("");
    setBusyId(id);
    try {
      await rejectApplication(id, reason.trim() || undefined);
      refresh();
    } catch (err) {
      console.error("Reject error:", err);
      setActionError(err.response?.data?.message || err.response?.data?.error || "Failed to reject application.");
    } finally {
      setBusyId(null);
    }
  }

  const statuses = ["PENDING", "APPROVED", "REJECTED", "ALL"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="destinations-hero">
        <div className="destinations-hero-overlay">
          <div className="container text-center">
            <h1 className="destinations-hero-title">Guide Applications</h1>
            <p className="destinations-hero-subtitle">
              Review tourists who applied to become guides, and approve or reject them.
            </p>
          </div>
        </div>
      </div>

      <section className="layout_padding" style={{ backgroundColor: "#fbfbfb" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0">Applications</h2>
              <p className="text-muted mt-1">
                Showing {applications.length} {statusFilter === "ALL" ? "total" : statusFilter.toLowerCase()} application{applications.length !== 1 ? "s" : ""}
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
                  {s}
                </button>
              ))}
            </div>
          </div>

          {actionError && <div className="alert alert-danger mb-4">{actionError}</div>}

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: 600 }}>
              <p>{error}</p>
              <button onClick={refresh} className="btn-nav-custom mt-2">Retry</button>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center my-5 py-5 bg-white rounded shadow-sm">
              <img src="/images/earth.png" alt="No applications" style={{ width: 64, opacity: 0.4, marginBottom: 16 }} />
              <h4 className="text-dark">No applications found</h4>
              <p className="text-muted mb-4">No applications match the current "{statusFilter}" filter.</p>
            </div>
          ) : (
            <div className="row">
              {applications.map((a) => (
                <div className="col-md-6 mb-4" key={a.id}>
                  <div className="bg-white rounded shadow-sm p-4 h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="font-weight-bold mb-0" style={{ color: "#01122a" }}>{a.applicantName}</h5>
                        <small className="text-muted">{a.applicantEmail}</small>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>

                    <div className="mb-2" style={{ fontSize: 13 }}>
                      <strong className="text-muted">Languages:</strong> {a.languages || "—"}
                    </div>
                    <div className="mb-2" style={{ fontSize: 13 }}>
                      <strong className="text-muted">Skills:</strong> {a.skills || "—"}
                    </div>
                    <div className="mb-2" style={{ fontSize: 13 }}>
                      <strong className="text-muted">Certifications:</strong> {a.certifications || "—"}
                    </div>
                    <div className="mb-2" style={{ fontSize: 13 }}>
                      <strong className="text-muted">Location:</strong> {a.location || "—"} &middot;{" "}
                      <strong className="text-muted">Experience:</strong> {a.yearsExperience ?? 0} yrs
                    </div>
                    {a.message && (
                      <div className="mb-3 p-2" style={{ fontSize: 13, background: "#f9f9fb", borderRadius: 6, fontStyle: "italic" }}>
                        "{a.message}"
                      </div>
                    )}
                    <div className="text-muted mb-3" style={{ fontSize: 12 }}>
                      Submitted {new Date(a.createdAt).toLocaleString()}
                    </div>
                    {a.status === "REJECTED" && a.reviewNote && (
                      <div className="mb-3" style={{ fontSize: 12, color: "#c0392b" }}>
                        Reason: {a.reviewNote}
                      </div>
                    )}

                    {a.status === "PENDING" && (
                      <div className="mt-auto pt-2">
                        {approvingId === a.id ? (
                          <div>
                            <label className="font-weight-bold text-dark mb-1" style={{ fontSize: 13 }}>
                              Set the guide's login password
                            </label>
                            <input
                              type="password"
                              className="tripbiz-input mb-2"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="At least 6 characters"
                              minLength={6}
                              disabled={busyId === a.id}
                            />
                            <div className="d-flex" style={{ gap: 8 }}>
                              <button
                                onClick={() => handleApprove(a.id)}
                                className="btn-nav-custom flex-grow-1"
                                disabled={busyId === a.id}
                                style={{ fontSize: 13 }}
                              >
                                {busyId === a.id ? "Approving..." : "Confirm Approve"}
                              </button>
                              <button
                                onClick={cancelApprove}
                                className="btn-outline-custom"
                                disabled={busyId === a.id}
                                style={{ fontSize: 13 }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex" style={{ gap: 8 }}>
                            <button
                              onClick={() => openApprove(a.id)}
                              className="btn-nav-custom flex-grow-1"
                              disabled={busyId === a.id}
                              style={{ fontSize: 13 }}
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleReject(a.id)}
                              className="btn-outline-custom"
                              disabled={busyId === a.id}
                              style={{ fontSize: 13, color: "#c0392b", borderColor: "#c0392b" }}
                            >
                              {busyId === a.id ? "..." : "✕ Reject"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
