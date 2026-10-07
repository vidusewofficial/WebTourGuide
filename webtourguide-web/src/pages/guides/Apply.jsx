import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applyToBeGuide, getMyApplications } from "../../api/guideApplicationApi";

const STATUS_META = {
  PENDING: { label: "Pending Review", bg: "#fff3e8", color: "#d86816", border: "#f5cba7" },
  APPROVED: { label: "Approved", bg: "#e6f7ed", color: "#0d8a4f", border: "#a9dfbf" },
  REJECTED: { label: "Not Approved", bg: "#fdecea", color: "#c0392b", border: "#f1a9a0" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, bg: "#f0f0f0", color: "#555", border: "#ccc" };
  return (
    <span style={{
      display: "inline-block", padding: "4px 14px", borderRadius: 20,
      fontSize: 12, fontWeight: 700, letterSpacing: "0.4px", textTransform: "uppercase",
      background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
    }}>
      {meta.label}
    </span>
  );
}

export default function GuideApply() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    languages: "",
    skills: "",
    certifications: "",
    location: "",
    yearsExperience: 0,
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error("Load applications error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const hasPending = applications.some((a) => a.status === "PENDING");

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
        location: form.location.trim() || null,
        yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience, 10) : 0,
        message: form.message.trim() || null,
      };

      await applyToBeGuide(payload);
      setSuccess("Application submitted! An admin will review it soon.");
      setForm({ languages: "", skills: "", certifications: "", location: "", yearsExperience: 0, message: "" });
      refresh();
    } catch (err) {
      console.error("Apply error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="py-5" style={{ backgroundColor: "#f9f9fb", minHeight: "80vh" }}>
      <div className="container">
        <div className="tripbiz-form-card">
          <h2>Apply to Become a Guide</h2>
          <p className="text-muted" style={{ marginTop: "-8px" }}>
            Tell us about your experience. If approved, an admin will set up your guide account
            and share your login password.
          </p>

          {applications.length > 0 && (
            <div className="mb-4">
              <h6 className="font-weight-bold text-muted mb-2" style={{ textTransform: "uppercase", fontSize: 12, letterSpacing: "0.5px" }}>
                Your Applications
              </h6>
              {applications.map((a) => (
                <div
                  key={a.id}
                  className="d-flex justify-content-between align-items-center mb-2 p-3"
                  style={{ background: "#f9f9fb", borderRadius: 8, border: "1px solid #eee" }}
                >
                  <div>
                    <div style={{ fontSize: 13, color: "#01122a", fontWeight: 600 }}>
                      Submitted {new Date(a.createdAt).toLocaleDateString()}
                    </div>
                    {a.status === "REJECTED" && a.reviewNote && (
                      <div style={{ fontSize: 12, color: "#c0392b", marginTop: 2 }}>Reason: {a.reviewNote}</div>
                    )}
                    {a.status === "APPROVED" && (
                      <div style={{ fontSize: 12, color: "#0d8a4f", marginTop: 2 }}>
                        Your guide account is ready — log in with the credentials your admin gave you.
                      </div>
                    )}
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}

          {error && <div className="alert alert-danger mb-4">{error}</div>}
          {success && <div className="alert alert-success mb-4">{success}</div>}

          {loading ? (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : hasPending ? (
            <div className="alert alert-warning">
              You already have a pending application. Please wait for it to be reviewed before
              submitting another one.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">Languages Spoken</label>
                <input
                  type="text" disabled={saving} name="languages" maxLength={300}
                  className="tripbiz-input" value={form.languages} onChange={handleChange}
                  placeholder="e.g. English, Sinhala, Tamil"
                />
                <small className="text-muted">Separate multiple languages with a comma.</small>
              </div>

              <div className="form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">Skills &amp; Specialisations</label>
                <input
                  type="text" disabled={saving} name="skills" maxLength={300}
                  className="tripbiz-input" value={form.skills} onChange={handleChange}
                  placeholder="e.g. Wildlife tours, hiking, photography"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">Certifications</label>
                <input
                  type="text" disabled={saving} name="certifications" maxLength={300}
                  className="tripbiz-input" value={form.certifications} onChange={handleChange}
                  placeholder="e.g. SLTDA Licensed Guide, First Aid"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">Operating Area / Destination</label>
                <input
                  type="text" disabled={saving} name="location" maxLength={150}
                  className="tripbiz-input" value={form.location} onChange={handleChange}
                  placeholder="e.g. Sigiriya, Kandy"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-weight-bold text-dark mb-1">
                  Years of Experience <span style={{ fontWeight: "normal", fontSize: 12, color: "#888" }}>(0 - 60)</span>
                </label>
                <input
                  type="number" disabled={saving} name="yearsExperience"
                  className="tripbiz-input" value={form.yearsExperience} onChange={handleChange}
                  min="0" max="60"
                />
              </div>

              <div className="form-group mb-4">
                <label className="font-weight-bold text-dark mb-1">Why do you want to become a guide?</label>
                <textarea
                  disabled={saving} name="message" maxLength={1000}
                  className="tripbiz-textarea" value={form.message} onChange={handleChange}
                  rows={4} placeholder="Tell us a bit about yourself and your experience..."
                />
              </div>

              <button type="submit" className="tripbiz-btn-primary" disabled={saving}>
                {saving ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}

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
