import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createDestination,
  getDestinationById,
  updateDestination,
} from "../../api/destinationApi";

export default function DestinationAdminForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    category: "Beach",
    location: "",
    description: "",
    imageUrl: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    async function loadExisting() {
      setLoadingExisting(true);
      setError("");
      try {
        const d = await getDestinationById(id);
        setForm({
          name: d.name || "",
          category: d.category || "Beach",
          location: d.location || "",
          description: d.description || "",
          imageUrl: d.imageUrl || "",
          latitude: d.latitude ?? "",
          longitude: d.longitude ?? "",
        });
      } catch (err) {
        console.error("Load destination error:", err);
        setError("Failed to load destination details.");
      } finally {
        setLoadingExisting(false);
      }
    }
    loadExisting();
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        location: form.location.trim(),
        description: form.description ? form.description.trim() : null,
        imageUrl: form.imageUrl ? form.imageUrl.trim() : null,
        latitude: form.latitude !== "" ? parseFloat(form.latitude) : null,
        longitude: form.longitude !== "" ? parseFloat(form.longitude) : null,
      };

      if (isEdit) {
        // galleryUrls is omitted, so the backend keeps the existing gallery
        await updateDestination(id, payload);
        setSuccess("Destination updated successfully!");
      } else {
        await createDestination(payload);
        setSuccess("Destination created successfully!");
      }

      setTimeout(() => {
        navigate(isEdit ? `/destinations/${id}` : "/destinations");
      }, 1200);
    } catch (err) {
      console.error(isEdit ? "Update destination error:" : "Create destination error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          `Failed to ${isEdit ? "update" : "create"} destination. Please check form values.`
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingExisting) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading destination...</span>
        </div>
        <p className="mt-3 text-muted">Loading destination details...</p>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: "#f9f9fb", minHeight: "80vh" }}>
      <div className="container">
        <div className="tripbiz-form-card">
          <h2>{isEdit ? "Edit Destination" : "Add New Destination"}</h2>

          {error && <div className="alert alert-danger mb-4">{error}</div>}
          {success && <div className="alert alert-success mb-4">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Destination Name *</label>
              <input
                type="text"
                name="name"
                className="tripbiz-input"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Mirissa Beach"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Category *</label>
              <select
                name="category"
                className="tripbiz-input"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="Beach">Beach</option>
                <option value="Mountain">Mountain & Hiking</option>
                <option value="Historical">Historical & Cultural</option>
                <option value="City">City & Nightlife</option>
                <option value="Nature">Nature & Wildlife</option>
                <option value="Adventure">Adventure</option>
                {/* Keep a category outside the standard list selectable when editing */}
                {!["Beach", "Mountain", "Historical", "City", "Nature", "Adventure"].includes(form.category) && (
                  <option value={form.category}>{form.category}</option>
                )}
              </select>
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Location / City *</label>
              <input
                type="text"
                name="location"
                className="tripbiz-input"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Matara, Sri Lanka"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Description</label>
              <textarea
                name="description"
                className="tripbiz-textarea"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe attractions, activities, and visiting tips..."
              />
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                className="tripbiz-input"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="row">
              <div className="col-md-6 form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  className="tripbiz-input"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 5.9482"
                />
              </div>

              <div className="col-md-6 form-group mb-4">
                <label className="font-weight-bold text-dark mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  className="tripbiz-input"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="e.g. 80.4578"
                />
              </div>
            </div>

            <button type="submit" className="tripbiz-btn-primary" disabled={loading}>
              {loading ? "Saving Destination..." : isEdit ? "Update Destination" : "Create Destination"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              to={isEdit ? `/destinations/${id}` : "/destinations"}
              className="text-muted font-weight-bold"
            >
              &larr; {isEdit ? "Back to Destination" : "Back to Destinations"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}