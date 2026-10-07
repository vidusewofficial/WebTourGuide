import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerGuide } from "../../api/guideApi";

export default function GuideCreateForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    languages: "",
    skills: "",
    certifications: "",
    location: "",
    yearsExperience: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

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
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || null,
        languages: form.languages.trim() || null,
        skills: form.skills.trim() || null,
        certifications: form.certifications.trim() || null,
        location: form.location.trim() || null,
        yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience, 10) : 0,
      };

      const created = await registerGuide(payload);

      setSuccess("Guide account created successfully! They can now log in with the email and password you set.");
      setTimeout(() => navigate(`/guides/${created.id}`), 1500);
    } catch (err) {
      console.error("Create guide error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create guide account. Please check form values."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="py-5" style={{ backgroundColor: "#f9f9fb", minHeight: "80vh" }}>
      <div className="container">
        <div className="tripbiz-form-card">
          <h2>Add New Guide</h2>
          <p className="text-muted" style={{ marginTop: "-8px" }}>
            Creates a login for this guide — they can sign in with the email and password below right after you save.
          </p>

          {error && <div className="alert alert-danger mb-4">{error}</div>}
          {success && <div className="alert alert-success mb-4">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Full Name *</label>
              <input
                type="text"
                disabled={saving} name="fullName"
                className="tripbiz-input"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Nimal Perera"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">Email *</label>
                <input
                  type="email"
                  disabled={saving} name="email"
                  className="tripbiz-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="guide@example.com"
                  required
                />
              </div>

              <div className="col-md-6 form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">Password *</label>
                <input
                  type="password"
                  disabled={saving} name="password"
                  className="tripbiz-input"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Phone</label>
              <input
                type="tel"
                disabled={saving} name="phone"
                className="tripbiz-input"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 077 123 4567"
              />
            </div>

            <hr className="my-4" />

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Languages Spoken</label>
              <input
                type="text"
                disabled={saving} name="languages" maxLength={300}
                className="tripbiz-input"
                value={form.languages}
                onChange={handleChange}
                placeholder="e.g. English, Sinhala, Tamil"
              />
              <small className="text-muted">Separate multiple languages with a comma.</small>
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Skills &amp; Specialisations</label>
              <input
                type="text"
                disabled={saving} name="skills" maxLength={300}
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
                disabled={saving} name="certifications" maxLength={300}
                className="tripbiz-input"
                value={form.certifications}
                onChange={handleChange}
                placeholder="e.g. SLTDA Licensed Guide, First Aid"
              />
            </div>

            <div className="form-group mb-3">
              <label className="font-weight-bold text-dark mb-1">Operating Area / Destination</label>
              <input
                type="text"
                disabled={saving} name="location" maxLength={150}
                className="tripbiz-input"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Sigiriya, Kandy"
              />
            </div>

            <div className="form-group mb-4">
              <label className="font-weight-bold text-dark mb-1">Years of Experience <span style={{fontWeight:"normal",fontSize:"12px",color:"#888"}}>(0 - 60)</span></label>
              <input
                type="number"
                disabled={saving} name="yearsExperience"
                className="tripbiz-input"
                value={form.yearsExperience}
                onChange={handleChange}
                min="0" max="60"
              />
            </div>

            <button type="submit" className="tripbiz-btn-primary" disabled={saving}>
              {saving ? "Creating Guide..." : "Create Guide"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/guides" className="text-muted font-weight-bold">
              &larr; Back to Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
