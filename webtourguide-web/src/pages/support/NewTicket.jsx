import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { createTicket } from "../../api/supportApi";
import { getMyBookings } from "../../api/bookingApi";

const TYPE_OPTIONS = [
  { value: "INQUIRY", label: "General Inquiry" },
  { value: "COMPLAINT", label: "Complaint" },
  { value: "CANCELLATION_REQUEST", label: "Cancellation Request" },
  { value: "RESCHEDULE_REQUEST", label: "Reschedule Request" },
];

const BOOKING_RELATED_TYPES = ["CANCELLATION_REQUEST", "RESCHEDULE_REQUEST"];

export default function NewTicket() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    type: searchParams.get("type") || "INQUIRY",
    subject: "",
    message: "",
    bookingId: searchParams.get("bookingId") || "",
  });
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const needsBooking = BOOKING_RELATED_TYPES.includes(form.type);

  useEffect(() => {
    if (needsBooking && bookings.length === 0) {
      getMyBookings().then(setBookings).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsBooking]);

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
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Short summary of your request"
                  required
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
                  className="tripbiz-input"
                />
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
