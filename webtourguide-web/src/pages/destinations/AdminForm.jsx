import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createDestination } from "../../api/destinationApi";

export default function DestinationAdminForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
    imageUrl: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
        name: form.name,
        category: form.category,
        location: form.location,
        description: form.description || null,
        imageUrl: form.imageUrl || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      };

      await createDestination(payload);

      setSuccess("Destination created successfully.");

      setTimeout(() => {
        navigate("/destinations");
      }, 1000);
    } catch (err) {
      console.error("Create destination error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create destination."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Add Destination</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name *</label>
          <br />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Category *</label>
          <br />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Beach, Mountain, Historical, City"
            required
          />
        </div>

        <br />

        <div>
          <label>Location *</label>
          <br />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Paris, France"
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <br />

        <div>
          <label>Image URL</label>
          <br />
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <br />

        <div>
          <label>Latitude</label>
          <br />
          <input
            type="number"
            step="any"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            placeholder="e.g. 48.8584"
          />
        </div>

        <br />

        <div>
          <label>Longitude</label>
          <br />
          <input
            type="number"
            step="any"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            placeholder="e.g. 2.2945"
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Destination"}
        </button>
      </form>

      <br />
      <Link to="/destinations">Back to Destinations</Link>
    </div>
  );
}