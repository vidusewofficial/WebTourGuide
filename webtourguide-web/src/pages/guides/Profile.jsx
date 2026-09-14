import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getGuide, updateGuideAvailability, deleteGuide } from "../../api/guideApi";
import { useAuth } from "../../context/AuthContext";

export default function GuideProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingAvail, setTogglingAvail] = useState(false);

  // A guide can edit their own profile; ADMIN can edit any
  const canEdit =
    user &&
    (user.role === "ADMIN" ||
      (user.role === "TOUR_GUIDE" && user.fullName === guide?.fullName));
  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";

  async function loadGuide() {
    setLoading(true);
    setError("");
    try {
      const data = await getGuide(id);
      setGuide(data);
    } catch (err) {
      console.error("Guide detail error:", err);
      setError("Failed to load guide details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadGuide();
  }, [id]);

  async function handleToggleAvailability() {
    setTogglingAvail(true);
    try {
      const updated = await updateGuideAvailability(id, !guide.isAvailable);
      setGuide(updated);
    } catch (err) {
      console.error("Toggle availability error:", err);
      alert(err.response?.data?.message || "Failed to update availability.");
    } finally {
      setTogglingAvail(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Remove this guide listing permanently?")) return;
    try {
      await deleteGuide(id);
      navigate("/guides");
    } catch (err) {
      console.error("Delete guide error:", err);
      alert("Failed to remove guide. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading guide...</span>
        </div>
        <p className="mt-3 text-muted">Loading guide profile, please wait...</p>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="container py-5 my-5 text-center">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: "600px" }}>
          <h4>Guide Not Found</h4>
          <p>{error || "The guide profile you are looking for does not exist."}</p>
          <Link to="/guides" className="btn-nav-custom mt-3 d-inline-block">
            Back to Guides
          </Link>
        </div>
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
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            to="/guides"
            className="btn-outline-custom d-inline-flex align-items-center"
            style={{ fontSize: "14px", padding: "6px 16px" }}
          >
            &larr; Back to Guides
          </Link>
        </div>

        <div className="row">
          {/* Main profile card */}
          <div className="col-lg-8 mb-4">
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
              {/* Header band */}
              <div
                className="rounded mb-4 text-center text-white p-4"
                style={{
                  background: "linear-gradient(135deg, #01122a 0%, #0a3060 100%)",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: "2.8rem", userSelect: "none",
                  }}
                >
                  🧭
                </div>
                <h2 className="text-white font-weight-bold mb-1">{guide.fullName}</h2>
                <p className="text-white-50 mb-2" style={{ fontSize: "14px" }}><a href={`mailto:${guide.email}</a>`} style={{color:"inherit"}}>
                  {guide.email}</a>
                </p>
                <span
                  className={`badge ${guide.isAvailable ? "badge-success" : "badge-secondary"}`}
                  style={{ fontSize: "13px", padding: "6px 14px" }}
                >
                  {guide.isAvailable ? "✓ Currently Available" : "✗ Not Available"}
                </span>
              </div>

              {/* Details grid */}
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h6 className="font-weight-bold text-muted mb-1" style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.5px" }}>
                    Languages Spoken
                  </h6>
                  <p className="text-dark font-weight-bold mb-0">{guide.languages || "—"}</p>
                </div>
                <div className="col-md-6 mb-4">
                  <h6 className="font-weight-bold text-muted mb-1" style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.5px" }}>
                    Years of Experience
                  </h6>
                  <p className="text-dark font-weight-bold mb-0">{guide.yearsExperience ?? 0} years</p>
                </div>
                <div className="col-md-6 mb-4">
                  <h6 className="font-weight-bold text-muted mb-1" style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.5px" }}>
                    Rating
                  </h6>
                  <p className="text-dark font-weight-bold mb-0">⭐ {guide.rating?.toFixed(1) ?? "0.0"} / 5.0</p>
                </div>
              </div>

              <hr />

              <div className="mb-4">
                <h5 className="font-weight-bold text-dark mb-2">Skills &amp; Specialisations</h5>
                <p className="text-secondary" style={{ lineHeight: "1.7" }}>
                  {guide.skills || <em>No skills listed.</em>}
                </p>
              </div>

              <div className="mb-4">
                <h5 className="font-weight-bold text-dark mb-2">Certifications</h5>
                <p className="text-secondary" style={{ lineHeight: "1.7" }}>
                  {guide.certifications || <em>No certifications listed.</em>}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Action panel — shown to guide themselves or admin */}
            {canEdit && (
              <div className="bg-white p-4 rounded shadow-sm mb-4">
                <h5 className="font-weight-bold mb-3" style={{ color: "#01122a" }}>
                  Manage Profile
                </h5>
                <Link
                  to={`/guides/${guide.id}/edit`}
                  className="btn-nav-custom d-block text-center mb-2"
                >
                  ✏️ Edit Profile
                </Link>
                <button
                  onClick={handleToggleAvailability}
                  className="btn-outline-custom d-block w-100 text-center"
                  disabled={togglingAvail}
                  style={{ marginTop: "8px" }}
                >
                  {togglingAvail
                    ? "Updating..."
                    : guide.isAvailable
                    ? "Set as Unavailable"
                    : "Set as Available"}
                </button>
              </div>
            )}

            {/* Admin-only: delete listing */}
            {isAdminOrStaff && (
              <div className="bg-white p-4 rounded shadow-sm mb-4">
                <h5 className="font-weight-bold mb-2" style={{ color: "#c0392b" }}>
                  Admin Actions
                </h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  Permanently remove this guide's listing from the platform.
                </p>
                <button
                  onClick={handleDelete}
                  className="btn-outline-custom d-block w-100 text-center"
                  style={{ color: "#c0392b", borderColor: "#c0392b" }}
                >
                  🗑 Remove Guide Listing
                </button>
              </div>
            )}

            {/* Hire / contact box */}
            <div className="p-4 rounded text-white" style={{ backgroundColor: "#01122a" }}>
              <h5 className="font-weight-bold text-white mb-2">Ready to Book?</h5>
              <p style={{ fontSize: "14px", color: "#ccc" }}>
                Contact our travel team to arrange a guided tour with {guide.fullName}.
              </p>
              <div className="d-flex align-items-center mt-3">
                <img
                  src="/images/call.png"
                  alt="Call"
                  style={{ width: "20px", height: "20px", marginRight: "10px" }}
                />
                <span className="font-weight-bold">+01 234 567 890</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}