import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createTicket } from "../../api/supportApi";

const TYPE_OPTIONS = [
  { value: "INQUIRY", label: "General Inquiry" },
  { value: "COMPLAINT", label: "Complaint" },
  { value: "CANCELLATION_REQUEST", label: "Cancellation Request" },
  { value: "RESCHEDULE_REQUEST", label: "Reschedule Request" },
];

export default function NewTicket() {
  const [form, setForm] = useState({ type: "INQUIRY", subject: "", message: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createTicket(form);
      navigate("/support/my");
    } catch (err) {
      setError(err.response?.data?.error || "Could not submit your request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
            <h1 className="destinations-hero-title">Contact Support</h1>
            <p className="destinations-hero-subtitle">
              Raise an inquiry, complaint, cancellation, or reschedule request.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="layout_padding" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container">
          <div className="tripbiz-form-card">
            <h2>New Support Request</h2>
            <p className="mb-3">
              <Link to="/support/my" className="text-muted">&larr; Back to My Support History</Link>
            </p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label style={{ fontWeight: 600, color: "#01122a", marginBottom: 8, display: "block" }}>
                  Request Type <span className="text-danger">*</span>
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="tripbiz-input"
                  style={{ appearance: "auto" }}
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-4">
                <label style={{ fontWeight: 600, color: "#01122a", marginBottom: 8, display: "block" }}>
                  Subject <span className="text-danger">*</span>
                  <span className="text-muted" style={{ fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
                    {form.subject.length}/200
                  </span>
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Short summary of your request"
                  required
                  autoFocus
                  maxLength={200}
                  className="tripbiz-input"
                />
              </div>

              <div className="form-group mb-4">
                <label style={{ fontWeight: 600, color: "#01122a", marginBottom: 8, display: "block" }}>
                  Message <span className="text-danger">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what happened..."
                  required
                  rows={6}
                  className="tripbiz-textarea"
                />
                <small className="text-muted mt-1 d-block">
                  Include your booking reference if this relates to a specific trip.
                </small>
              </div>

              <button type="submit" className="tripbiz-btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request →"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
