import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getDestinationById,
  updateDestination,
  deleteDestination,
} from "../../api/destinationApi";

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    location: "",
    description: "",
    imageUrl: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    async function loadDestination() {
      try {
        const data = await getDestinationById(id);

        setDestination(data);

        setForm({
          name: data.name || "",
          category: data.category || "",
          location: data.location || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
        });
      } catch (err) {
        console.error("Destination details error:", err);
        setError("Failed to load destination.");
      } finally {
        setLoading(false);
      }
    }

    loadDestination();
  }, [id]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();

    setError("");

    try {
      const updated = await updateDestination(id, form);

      setDestination(updated);
      setEditMode(false);

      alert("Destination updated successfully.");
    } catch (err) {
      console.error("Update destination error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update destination."
      );
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this destination?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDestination(id);

      alert("Destination deleted successfully.");

      navigate("/destinations");
    } catch (err) {
      console.error("Delete destination error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete destination."
      );
    }
  }

  if (loading) {
    return <p>Loading destination...</p>;
  }

  if (error && !destination) {
    return <p>{error}</p>;
  }

  if (!destination) {
    return <p>Destination not found.</p>;
  }

  /* =========================
     EDIT MODE
     ========================= */
  if (editMode) {
    return (
      <div>
        <h1>Edit Destination</h1>

        {error && <p>{error}</p>}

        <form onSubmit={handleUpdate}>
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
            />
          </div>

          <br />

          <div>
            <label>Image URL</label>
            <br />

            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
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
            />
          </div>

          <br />

          <button type="submit">
            Save Changes
          </button>

          {" "}

          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setError("");
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  /* =========================
     VIEW MODE
     ========================= */
  return (
    <div>
      <h1>{destination.name}</h1>

      <p>
        <strong>Category:</strong>{" "}
        {destination.category}
      </p>

      <p>
        <strong>Description:</strong>{" "}
        {destination.description}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {destination.location}
      </p>

      {destination.imageUrl && (
        <div>
          <img
            src={destination.imageUrl}
            alt={destination.name}
            width="300"
          />
        </div>
      )}

      <br />

      <button onClick={() => setEditMode(true)}>
        Edit Destination
      </button>

      {" "}

      <button onClick={handleDelete}>
        Delete Destination
      </button>

      {" "}

      <Link to="/destinations">
        Back to Destinations
      </Link>
    </div>
  );
}