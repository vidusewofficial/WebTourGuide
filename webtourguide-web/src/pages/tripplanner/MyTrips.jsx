/* Trip Planning Module — Group Y2-S1-MLB-B2G2-03 */
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getMyTripPlans, createTripPlan, updateTripPlan, deleteTripPlan } from "../../api/tripPlanApi";
import { MAX_TRIP_TITLE_LENGTH } from "../../constants/tripPlanConstants";
import "./tripplanner.css";

/**
 * MyTrips page — shows all trip plans for the logged-in tourist.
 * Allows creating a new plan and deleting an existing one.
 * Click "Edit Itinerary" to go to TripEditor and add day-by-day items.
 *
 * Arriving here from a Destination page with ?addDestinationId=&addDestinationName=
 * lets the tourist drop that destination straight into an existing or brand-new trip.
 */
export default function MyTrips() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const addDestinationId = searchParams.get("addDestinationId");
  const addDestinationName = searchParams.get("addDestinationName");

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [addingTripId, setAddingTripId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", startDate: "", endDate: "" });
  const [error, setError] = useState("");
  const [dateWarning, setDateWarning] = useState("");

  function refresh() {
    setLoading(true);
    getMyTripPlans()
      .then(setTrips)
      .catch(() => setError("Failed to load trip plans. Please try again."))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  function handleChange(e) {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    // Client-side date range validation
    if (updated.startDate && updated.endDate && updated.startDate > updated.endDate) {
      setDateWarning("Start date must not be after end date.");
    } else {
      setDateWarning("");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (dateWarning) return;
    setCreating(true);
    setError("");
    try {
      const plan = await createTripPlan({
        title: form.title,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      });
      setForm({ title: "", startDate: "", endDate: "" });
      setShowForm(false);
      if (addDestinationId) {
        await addDestinationToTrip(plan);
      } else {
        refresh();
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create trip plan.");
    } finally {
      setCreating(false);
    }
  }

  /** Appends the destination from the query string as the next day of `trip`, then opens the editor. */
  async function addDestinationToTrip(trip) {
    setAddingTripId(trip.id);
    setError("");
    try {
      const existingItems = trip.items || [];
      const nextDay =
        existingItems.length > 0
          ? Math.max(...existingItems.map((i) => Number(i.dayNumber) || 0)) + 1
          : 1;
      const items = [
        ...existingItems.map((i) => ({
          destinationId: i.destinationId || null,
          dayNumber: i.dayNumber,
          accommodation: i.accommodation || null,
          transportation: i.transportation || null,
          activities: i.activities || null,
          notes: i.notes || null,
        })),
        { destinationId: Number(addDestinationId), dayNumber: nextDay },
      ];
      await updateTripPlan(trip.id, {
        title: trip.title,
        startDate: trip.startDate,
        endDate: trip.endDate,
        items,
      });
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to add destination to this trip.");
    } finally {
      setAddingTripId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this trip plan? This cannot be undone.")) return;
    try {
      await deleteTripPlan(id);
      refresh();
    } catch {
      setError("Failed to delete trip plan. Please try again.");
    }
  }

  function formatDate(d) {
    if (!d) return "?";
    return d;
  }

  return (
    <div style={{ minHeight: "80vh", background: "#f4f7fb", padding: "40px 20px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0c1730", margin: 0 }}>
              🗺️ My Trip Plans
            </h1>
            <p style={{ color: "#6b7280", marginTop: 6, marginBottom: 0, fontSize: 14 }}>
              Plan your perfect itinerary day by day.
            </p>
          </div>
          <button
            onClick={() => { setShowForm((v) => !v); setError(""); setDateWarning(""); }}
            style={{
              background: "#f07b26",
              color: "#fff",
              border: "none",
              borderRadius: 24,
              padding: "10px 24px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            {showForm ? "✕ Cancel" : "+ New Trip"}
          </button>
        </div>

        {/* ── Add-destination banner ── */}
        {addDestinationId && (
          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              color: "#9a3412",
              padding: "14px 18px",
              borderRadius: 8,
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span>
              📍 Adding <strong>{addDestinationName || "this destination"}</strong> to a trip — pick a
              trip below, or create a new one.
            </span>
            <button
              onClick={() => setSearchParams({})}
              style={{ background: "transparent", border: "none", color: "#9a3412", fontWeight: 600, cursor: "pointer" }}
            >
              ✕ Cancel
            </button>
          </div>
        )}

        {/* ── Error banner ── */}
        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 18px", borderRadius: 8, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* ── Create form ── */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              marginBottom: 32,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: "1 1 220px" }}>
              <label style={{ fontWeight: 600, color: "#374151", fontSize: 13, display: "block", marginBottom: 6 }}>
                Trip Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. South Coast Getaway"
                required
                maxLength={MAX_TRIP_TITLE_LENGTH}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ fontWeight: 600, color: "#374151", fontSize: 13, display: "block", marginBottom: 6 }}>
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ fontWeight: 600, color: "#374151", fontSize: 13, display: "block", marginBottom: 6 }}>
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ width: "100%" }}>
              {dateWarning && (
                <p style={{ color: "#b45309", fontSize: 13, margin: "0 0 8px 0" }}>⚠️ {dateWarning}</p>
              )}
              <button
                type="submit"
                disabled={creating || !!dateWarning}
                style={{
                  background: (creating || dateWarning) ? "#9ca3af" : "#0c1730",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 28px",
                  fontWeight: 600,
                  cursor: (creating || dateWarning) ? "not-allowed" : "pointer",
                  fontSize: 14,
                }}
              >
                {creating ? "Creating..." : "Create Trip"}
              </button>
            </div>
          </form>
        )}

        {/* ── Trip list ── */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>Loading your trips...</div>
        ) : trips.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              background: "#fff",
              borderRadius: 12,
              padding: 60,
              color: "#6b7280",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
            <p style={{ fontSize: 16 }}>
              No trip plans yet. Click <strong>+ New Trip</strong> to start planning.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {trips.map((t) => (
              <div key={t.id} className="trip-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ fontWeight: 700, fontSize: 17, color: "#0c1730", margin: 0, flex: 1, marginRight: 8 }}>
                    {t.title}
                  </h3>
                  <span
                    style={{
                      background: "#fef3c7",
                      color: "#92400e",
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.items.length} day{t.items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {(t.startDate || t.endDate) && (
                  <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
                    📅 {formatDate(t.startDate)} → {formatDate(t.endDate)}
                  </p>
                )}

                {t.createdAt && (
                  <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
                    Created: {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Link
                    to={`/trips/${t.id}`}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      background: "#0c1730",
                      color: "#fff",
                      padding: "8px 0",
                      borderRadius: 8,
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Edit Itinerary
                  </Link>
                  <button
                    onClick={() => handleDelete(t.id)}
                    style={{
                      flex: 1,
                      background: "#fee2e2",
                      color: "#991b1b",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 0",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
