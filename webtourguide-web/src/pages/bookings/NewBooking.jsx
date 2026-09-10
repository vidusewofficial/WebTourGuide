import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../api/bookingApi";
import axiosClient from "../../api/axiosClient";

export default function NewBooking() {
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [form, setForm] = useState({
    packageId: "",
    guideId: "",
    bookingDate: "",
    participants: 1,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get("/packages").then((r) => setPackages(r.data)).catch(() => {});
    axiosClient.get("/guides").then((r) => setGuides(r.data)).catch(() => {});
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const selectedPackage = packages.find((p) => String(p.id) === String(form.packageId));
  const estimatedTotal =
    selectedPackage && form.participants
      ? (selectedPackage.price * Number(form.participants)).toFixed(2)
      : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        packageId: Number(form.packageId),
        guideId: form.guideId ? Number(form.guideId) : undefined,
        bookingDate: form.bookingDate,
        participants: Number(form.participants),
      };
      await createBooking(payload);
      navigate("/bookings/my");
    } catch (err) {
      setError(err.response?.data?.error || "Could not create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: "32px", border: "1px solid #e0e0e0", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
      <h2 style={{ marginBottom: 24 }}>Book a Tour Package</h2>
      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #ffb3b3", color: "#c0392b", padding: "10px 14px", borderRadius: 6, marginBottom: 18 }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Tour Package *</label>
          <select
            name="packageId"
            value={form.packageId}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }}
          >
            <option value="">— Select a package —</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} — LKR {p.price} ({p.durationDays} day{p.durationDays !== 1 ? "s" : ""})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Tour Guide <span style={{ fontWeight: 400, color: "#888" }}>(optional)</span></label>
          <select
            name="guideId"
            value={form.guideId}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }}
          >
            <option value="">— No guide —</option>
            {guides
              .filter((g) => g.isAvailable !== false)
              .map((g) => (
                <option key={g.id} value={g.id}>
                  {g.user?.fullName || g.fullName || `Guide #${g.id}`}
                  {g.languages ? ` — ${g.languages}` : ""}
                </option>
              ))}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Booking Date *</label>
          <input
            name="bookingDate"
            type="date"
            value={form.bookingDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Number of Participants *</label>
          <input
            name="participants"
            type="number"
            min="1"
            max={selectedPackage?.maxParticipants || 99}
            value={form.participants}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14, boxSizing: "border-box" }}
          />
          {selectedPackage && (
            <small style={{ color: "#888" }}>Max {selectedPackage.maxParticipants} participants for this package</small>
          )}
        </div>

        {estimatedTotal && (
          <div style={{ background: "#f0f7ff", border: "1px solid #b3d4ff", padding: "10px 14px", borderRadius: 6, marginBottom: 20, fontWeight: 600 }}>
            Estimated Total: LKR {estimatedTotal}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "12px", background: loading ? "#aaa" : "#1a73e8", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}
