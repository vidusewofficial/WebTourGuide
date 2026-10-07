import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { createPackage, getPackage, updatePackage } from "../../api/packageApi";
import { getDestinations } from "../../api/destinationApi";

export default function PackageAdminForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    destinationId: "",
    title: "",
    description: "",
    durationDays: 1,
    price: 0,
    maxParticipants: 10,
    active: true,
  });

  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    async function loadExisting() {
      setLoadingExisting(true);
      setError("");
      try {
        const p = await getPackage(id);
        setForm({
          destinationId: p.destination?.id ?? "",
          title: p.title || "",
          description: p.description || "",
          durationDays: p.durationDays ?? 1,
          price: p.price ?? 0,
          maxParticipants: p.maxParticipants ?? 10,
          active: p.active !== false,
        });
      } catch (err) {
        console.error("Load package error:", err);
        setError("Failed to load tour package details.");
      } finally {
        setLoadingExisting(false);
      }
    }
    loadExisting();
  }, [id, isEdit]);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const list = await getDestinations();
        setDestinations(list);
        if (list.length > 0) {
          setForm((prev) => ({
            ...prev,
            destinationId: prev.destinationId || list[0].id,
          }));
        }
      } catch (err) {
        console.error("Failed to load destinations for dropdown:", err);
      } finally {
        setLoadingDestinations(false);
      }
    }
    loadDestinations();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.destinationId) {
      setError("Please select a destination.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        destinationId: Number(form.destinationId),
        title: form.title.trim(),
        description: form.description ? form.description.trim() : "",
        durationDays: Number(form.durationDays),
        price: Number(form.price),
        maxParticipants: form.maxParticipants !== "" ? Number(form.maxParticipants) : null,
        active: Boolean(form.active),
      };

      if (isEdit) {
        // imageUrl/galleryUrls are omitted, so the backend keeps the existing photos
        await updatePackage(id, payload);
        setSuccess("Tour Package updated successfully!");
      } else {
        await createPackage(payload);
        setSuccess("Tour Package created successfully!");
      }
      setTimeout(() => {
        navigate(isEdit ? `/packages/${id}` : "/packages");
      }, 1200);
    } catch (err) {
      console.error(isEdit ? "Update package error:" : "Create package error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          `Failed to ${isEdit ? "update" : "create"} tour package. Please check your inputs.`
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingExisting) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading package...</span>
        </div>
        <p className="mt-3 text-muted">Loading tour package details...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="py-5"
      style={{ backgroundColor: "#f9f9fb", minHeight: "80vh" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container">
        <div className="tripbiz-form-card">
          <h2>{isEdit ? "Edit Tour Package" : "Add Tour Package"}</h2>

          {error && <div className="alert alert-danger mb-4">{error}</div>}
          {success && <div className="alert alert-success mb-4">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Destination Selection */}
            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">
                Destination *
              </label>
              {destinations.length > 0 ? (
                <select
                  name="destinationId"
                  className="tripbiz-input"
                  value={form.destinationId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Destination --</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.location}) [ID: {d.id}]
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  name="destinationId"
                  className="tripbiz-input"
                  value={form.destinationId}
                  onChange={handleChange}
                  placeholder="Enter Destination ID"
                  required
                />
              )}
              {loadingDestinations && (
                <small className="text-muted d-block mt-1">Loading destinations list...</small>
              )}
            </div>

            {/* Package Title */}
            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Package Title *</label>
              <input
                type="text"
                name="title"
                className="tripbiz-input"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. 3-Day Tropical Ella Adventure"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Description</label>
              <textarea
                name="description"
                className="tripbiz-textarea"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Detailed itinerary, included activities, meal plans, guide details..."
              />
            </div>

            {/* Duration and Price */}
            <div className="row">
              <div className="col-md-6 form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  min="1"
                  name="durationDays"
                  className="tripbiz-input"
                  value={form.durationDays}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">
                  Price ($ per person) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  className="tripbiz-input"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Max Participants & Active */}
            <div className="row align-items-center mb-4">
              <div className="col-md-6 form-group mb-3 mb-md-0">
                <label className="font-weight-bold text-dark mb-1">
                  Max Participants
                </label>
                <input
                  type="number"
                  min="1"
                  name="maxParticipants"
                  className="tripbiz-input"
                  value={form.maxParticipants}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 form-group mb-0">
                <div className="d-flex align-items-center pt-md-3">
                  <input
                    type="checkbox"
                    id="packageActive"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    style={{ width: "20px", height: "20px", accentColor: "#f07b26", marginRight: "10px", cursor: "pointer" }}
                  />
                  <label htmlFor="packageActive" className="font-weight-bold text-dark m-0" style={{ cursor: "pointer" }}>
                    Package is Active &amp; Bookable
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="tripbiz-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving Package..." : isEdit ? "Update Tour Package" : "Save Tour Package"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/packages" className="text-muted font-weight-bold">
              &larr; Back to Tour Packages
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
