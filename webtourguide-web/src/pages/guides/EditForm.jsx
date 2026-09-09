import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGuide, updateGuideProfile, updateGuideAvailability } from "../../api/guideApi";

export default function GuideEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    languages: "",
    skills: "",
    certifications: "",
    yearsExperience: 0,
  });
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getGuide(id)
      .then((g) => {
        setForm({
          languages: g.languages || "",
          skills: g.skills || "",
          certifications: g.certifications || "",
          yearsExperience: g.yearsExperience || 0,
        });
        setIsAvailable(g.isAvailable ?? true);
      })
      .catch((err) => {
        console.error("Load guide error:", err);
        setError("Failed to load guide profile.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        languages: form.languages.trim() || null,
        skills: form.skills.trim() || null,
        certifications: form.certifications.trim() || null,
        yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience, 10) : 0,
      };

      await updateGuideProfile(id, payload);
      await updateGuideAvailability(id, isAvailable);

      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate(`/guides/${id}`), 1200);
    } catch (err) {
      console.error("Update guide error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update profile. You may only edit your own profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading guide profile...</p>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: "#f9f9fb", minHeight: "80vh" }}>
      <div className="container">
        <div className="tripbiz-form-card">
          <h2>Edit Guide Profile</h2>

          {error && <div className="alert alert-danger mb-4">{error}</div>}
          {success && <div className="alert alert-success mb-4">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Languages Spoken</label>
              <input
                type="text"
                name="languages"
                className="tripbiz-input"
                value={form.languages}
                onChange={handleChange}
                placeholder="e.g. English, Sinhala, Tamil"
              />
              <small className="text-muted">Separate multiple languages with a comma.</small>{" "}<small className="text-muted float-right">{form.languages.length}/300</small>
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Skills &amp; Specialisations</label>
              <input
                type="text"
                name="skills"
                className="tripbiz-input"
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g. Wildlife tours, hiking, photography"
              />
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Certifications</label>
              <input
                type="text"
                name="certifications"
                className="tripbiz-input"
                value={form.certifications}
                onChange={handleChange}
                placeholder="e.g. SLTDA Licensed Guide, First Aid"
              />
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Years of Experience</label>
              <input
                type="number"
                name="yearsExperience"
                className="tripbiz-input"
                value={form.yearsExperience}
                onChange={handleChange}
                min="0"
                max="60"
              />
            </div>

            <div className="form-group mb-4">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="isAvailable"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
                <label className="custom-control-label font-weight-bold text-dark" htmlFor="isAvailable">
                  Currently available for bookings
                </label>
              </div>
            </div>

            <button type="submit" className="tripbiz-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to={`/guides/${id}`} className="text-muted font-weight-bold">
              &larr; Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}