import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createBooking } from "../../api/bookingApi";
import axiosClient from "../../api/axiosClient";

export default function NewBooking() {
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [form, setForm] = useState({ packageId: "", guideId: "", bookingDate: "", participants: 1 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axiosClient.get("/packages").then((r) => setPackages(r.data)).catch(() => {}),
      axiosClient.get("/guides").then((r) => setGuides(r.data)).catch(() => {}),
    ]).finally(() => setLoadingData(false));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const selectedPackage = packages.find((p) => String(p.id) === String(form.packageId));
  const estimatedTotal =
    selectedPackage && form.participants
      ? (selectedPackage.price * Number(form.participants)).toLocaleString("en-LK", { minimumFractionDigits: 2 })
      : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createBooking({
        packageId: Number(form.packageId),
        guideId: form.guideId ? Number(form.guideId) : undefined,
        bookingDate: form.bookingDate,
        participants: Number(form.participants),
      });
      navigate("/bookings/my");
    } catch (err) {
      setError(err.response?.data?.error || "Could not create booking. Please try again.");
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
            <h1 className="destinations-hero-title">Book a Tour Package</h1>
            <p className="destinations-hero-subtitle">
              Choose your package, pick a date, and confirm your booking in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="layout_padding" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container">
          {loadingData ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading available packages...</p>
            </div>
          ) : (
            <div className="tripbiz-form-card">
              <h2>New Booking</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Package */}
                <div className="form-group mb-4">
                  <label style={{ fontWeight: 600, color: "#01122a", marginBottom: 8, display: "block" }}>
                    Tour Package <span className="text-danger">*</span>
                  </label>
                  <select
                    name="packageId"
                    value={form.packageId}
                    onChange={handleChange}
                    required
                    className="tripbiz-input"
                    style={{ appearance: "auto" }}
                  >
                    <option value="">— Select a package —</option>
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                        {p.durationDays ? ` — ${p.durationDays} day${p.durationDays !== 1 ? "s" : ""}` : ""}
                        {p.price ? ` — LKR ${Number(p.price).toLocaleString()}` : ""}
                      </option>
                    ))}
                  </select>
                  {selectedPackage && (
                    <small className="text-muted mt-1 d-block">
                      Max {selectedPackage.maxParticipants} participants &nbsp;·&nbsp;
                      {selectedPackage.destination?.location || selectedPackage.destination?.name || ""}
                    </small>
                  )}
                </div>

                {/* Guide */}
                <div className="form-group mb-4">
                  <label style={{ fontWeight: 600, color: "#01122a", marginBottom: 8, display: "block" }}>
                    Tour Guide <span className="text-muted" style={{ fontWeight: 400 }}>(optional)</span>
                  </label>
                  <select
                    name="guideId"
                    value={form.guideId}
                    onChange={handleChange}
                    className="tripbiz-input"
                    style={{ appearance: "auto" }}
                  >
                    <option value="">— No guide / Assign later —</option>
                    {guides
                      .filter((g) => g.isAvailable !== false)
                      .map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.user?.fullName || `Guide #${g.id}`}
                          {g.languages ? ` — ${g.languages}` : ""}
                          {g.rating ? ` — ★ ${g.rating}` : ""}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Date & Participants row */}
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label style={{ fontWeight: 600, color: "#01122a", marginBottom: 8, display: "block" }}>
                      Booking Date <span className="text-danger">*</span>
                    </label>
                    <input
                      name="bookingDate"
                      type="date"
                      value={form.bookingDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="tripbiz-input"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label style={{ fontWeight: 600, color: "#01122a", marginBottom: 8, display: "block" }}>
                      Participants <span className="text-danger">*</span>
                    </label>
                    <input
                      name="participants"
                      type="number"
                      min="1"
                      max={selectedPackage?.maxParticipants || 99}
                      value={form.participants}
                      onChange={handleChange}
                      required
                      className="tripbiz-input"
                    />
                  </div>
                </div>

                {/* Estimated total */}
                {estimatedTotal && (
                  <div
                    className="mb-4 p-3 rounded"
                    style={{ background: "#e6f7ed", border: "1px solid #b7e4c7" }}
                  >
                    <span style={{ fontWeight: 700, color: "#0d8a4f", fontSize: "1.05rem" }}>
                      Estimated Total: LKR {estimatedTotal}
                    </span>
                    <small className="text-muted d-block mt-1">
                      LKR {Number(selectedPackage.price).toLocaleString()} × {form.participants} participant{form.participants != 1 ? "s" : ""}
                    </small>
                  </div>
                )}

                <button type="submit" className="tripbiz-btn-primary" disabled={loading}>
                  {loading ? "Confirming Booking..." : "Confirm Booking →"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
