import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getTripPlan, updateTripPlan } from "../../api/tripPlanApi";
import "./tripplanner.css";

/**
 * TripEditor page — lets a tourist add, remove, and reorder day items
 * inside an existing trip plan, then save them all in one PUT request.
 *
 * Key behaviour:
 *   - Days are sorted by dayNumber before rendering so they stay in order.
 *   - Removing a day only removes it from local state; it is not deleted on
 *     the server until the tourist clicks "Save Itinerary".
 *   - The backend's orphanRemoval handles deleting removed rows automatically.
 *   - destinationId can be left blank for a "rest day" with no destination.
 */
export default function TripEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    getTripPlan(id)
      .then((p) => {
        setPlan(p);
        setItems(p.items || []);
      })
      .catch(() => setError("Failed to load trip plan."))
      .finally(() => setLoading(false));
  }, [id]);

  /** Updates a single field in the item at the given index. */
  function updateItem(index, field, value) {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  }

  /** Adds a new empty day with the next sequential day number. */
  function addDay() {
    const nextDay =
      items.length > 0 ? Math.max(...items.map((i) => Number(i.dayNumber) || 0)) + 1 : 1;
    setItems([
      ...items,
      {
        destinationId: "",
        dayNumber: nextDay,
        accommodation: "",
        transportation: "",
        activities: "",
        notes: "",
      },
    ]);
  }

  /** Removes a day from local state (server delete happens on Save). */
  function removeDay(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  /** Sends the full updated plan (title, dates, all items) to the server. */
  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        title: plan.title,
        startDate: plan.startDate,
        endDate: plan.endDate,
        items: items.map((it) => ({
          destinationId: it.destinationId ? Number(it.destinationId) : null,
          dayNumber: Number(it.dayNumber),
          accommodation: it.accommodation || null,
          transportation: it.transportation || null,
          activities: it.activities || null,
          notes: it.notes || null,
        })),
      };
      await updateTripPlan(id, payload);
      setSuccess("Itinerary saved successfully!");
      setTimeout(() => navigate("/trips"), 1400);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to save itinerary.");
    } finally {
      setSaving(false);
    }
  }

  // Sort days by dayNumber for display
  const sortedItems = [...items].sort(
    (a, b) => (Number(a.dayNumber) || 0) - (Number(b.dayNumber) || 0)
  );
  // Map sorted index back to original index so updateItem still works
  function getOriginalIndex(sortedItem) {
    return items.indexOf(sortedItem);
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
        Loading itinerary...
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#991b1b" }}>
        {error}
        <br />
        <Link to="/trips" style={{ color: "#0c1730", fontWeight: 600 }}>
          ← Back to My Trips
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh", background: "#f4f7fb", padding: "40px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Back link */}
        <Link
          to="/trips"
          style={{
            color: "#6b7280",
            textDecoration: "none",
            fontSize: 13,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 20,
          }}
        >
          ← Back to My Trips
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontWeight: 700, fontSize: 26, color: "#0c1730", margin: 0 }}>
              {plan?.title}
            </h1>
            {/* Day count badge */}
            <span
              style={{
                background: "#fef3c7",
                color: "#92400e",
                fontSize: 13,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 20,
              }}
            >
              {items.length} day{items.length !== 1 ? "s" : ""} in this plan
            </span>
          </div>
          {(plan?.startDate || plan?.endDate) && (
            <p style={{ color: "#6b7280", marginTop: 6, fontSize: 14 }}>
              📅 {plan.startDate || "?"} → {plan.endDate || "?"}
            </p>
          )}
        </div>

        {/* Status messages */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px 18px",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              background: "#d1fae5",
              color: "#065f46",
              padding: "12px 18px",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            ✅ {success}
          </div>
        )}

        {/* Day cards */}
        {sortedItems.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 40,
              textAlign: "center",
              color: "#6b7280",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>📆</div>
            <p>
              No days added yet. Click <strong>+ Add a Day</strong> to start building your
              itinerary.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {sortedItems.map((item) => {
              const origIdx = getOriginalIndex(item);
              return (
                <div key={origIdx} className="trip-day-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#0c1730", fontSize: 15 }}>
                      Day {item.dayNumber}
                      {/* Show destination name when one is already saved */}
                      {item.destinationName && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontWeight: 400,
                            fontSize: 13,
                            color: "#f07b26",
                          }}
                        >
                          📍 {item.destinationName}
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => removeDay(origIdx)}
                      style={{
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "none",
                        borderRadius: 6,
                        padding: "4px 12px",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Day Number
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={item.dayNumber}
                        onChange={(e) => updateItem(origIdx, "dayNumber", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #d1d5db",
                          fontSize: 13,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Destination ID{" "}
                        <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
                      </label>
                      <input
                        type="number"
                        value={item.destinationId || ""}
                        onChange={(e) => updateItem(origIdx, "destinationId", e.target.value)}
                        placeholder="Leave blank for rest day"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #d1d5db",
                          fontSize: 13,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Accommodation
                      </label>
                      <input
                        value={item.accommodation || ""}
                        onChange={(e) => updateItem(origIdx, "accommodation", e.target.value)}
                        placeholder="Hotel or guesthouse name"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #d1d5db",
                          fontSize: 13,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Transportation
                      </label>
                      <input
                        value={item.transportation || ""}
                        onChange={(e) => updateItem(origIdx, "transportation", e.target.value)}
                        placeholder="e.g. Private van, Train"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #d1d5db",
                          fontSize: 13,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Activities
                      </label>
                      <input
                        value={item.activities || ""}
                        onChange={(e) => updateItem(origIdx, "activities", e.target.value)}
                        placeholder="e.g. Hiking, wildlife safari, city tour"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #d1d5db",
                          fontSize: 13,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Notes
                      </label>
                      <input
                        value={item.notes || ""}
                        onChange={(e) => updateItem(origIdx, "notes", e.target.value)}
                        placeholder="Any special notes for this day"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #d1d5db",
                          fontSize: 13,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={addDay}
            style={{
              background: "#fff",
              color: "#0c1730",
              border: "2px solid #0c1730",
              borderRadius: 8,
              padding: "10px 22px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            + Add a Day
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? "#9ca3af" : "#f07b26",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 28px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: 14,
            }}
          >
            {saving ? "Saving..." : "💾 Save Itinerary"}
          </button>
        </div>
      </div>
    </div>
  );
}
