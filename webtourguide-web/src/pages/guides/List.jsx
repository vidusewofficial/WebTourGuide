import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getGuides, getAvailableGuides, searchGuidesByLanguage, deleteGuide } from "../../api/guideApi";
import { useAuth } from "../../context/AuthContext";

export default function GuideList() {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";

  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  async function loadAllGuides() {
    setLoading(true);
    setError("");
    try {
      const data = await getGuides();
      setGuides(data);
    } catch (err) {
      console.error("Guide API error:", err);
      setError("Failed to load tour guides. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllGuides();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let data;
      if (language.trim()) {
        data = await searchGuidesByLanguage(language.trim());
      } else if (availableOnly) {
        data = await getAvailableGuides();
      } else {
        data = await getGuides();
      }
      setGuides(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search guides.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setLanguage("");
    setAvailableOnly(false);
    loadAllGuides();
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this guide listing?")) return;
    try {
      await deleteGuide(id);
      setGuides((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Delete guide error:", err);
      alert("Failed to remove guide. Please try again.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero banner with search */}
      <div className="destinations-hero">
        <div className="destinations-hero-overlay">
          <div className="container">
            <div className="text-center mb-4">
              <h1 className="destinations-hero-title">Find Your Perfect Tour Guide</h1>
              <p className="destinations-hero-subtitle">
                Browse experienced, certified guides speaking your language — ready to make your trip unforgettable.
              </p>
            </div>

            <div className="destinations-search-card">
              <form onSubmit={handleSearch}>
                <div className="row align-items-end" style={{ gap: "0" }}>
                  <div className="col-md-5 mb-3 mb-md-0">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text" style={{ background: "#041f3d" }}>
                          <img src="/images/search-icon.png" alt="Search" style={{ width: "18px" }} />
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Language, e.g. Tamil, Sinhala"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mb-3 mb-md-0 d-flex align-items-center pl-3">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="availableOnly"
                        checked={availableOnly}
                        onChange={(e) => setAvailableOnly(e.target.checked)}
                      />
                      <label className="custom-control-label text-white font-weight-bold" htmlFor="availableOnly">
                        Available now only
                      </label>
                    </div>
                  </div>

                  <div className="col-md-3 d-flex" style={{ gap: "8px" }}>
                    <button type="submit" className="btn-nav-custom flex-grow-1">
                      Search
                    </button>
                    {(language || availableOnly) && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn-outline-custom"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Guide cards grid */}
      <section className="layout_padding" style={{ backgroundColor: "#fbfbfb" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0">All Tour Guides <span className="badge badge-primary ml-2" style={{fontSize:"14px",verticalAlign:"middle"}}>{guides.length}</span></h2>
              <p className="text-muted mt-1">
                Certified, experienced guides to accompany you on every journey across Sri Lanka.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading guides...</span>
              </div>
              <p className="mt-3 text-muted">Loading guides...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: "600px" }}>
              <p>{error}</p>
              <button onClick={loadAllGuides} className="btn-nav-custom mt-2">
                Retry
              </button>
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center my-5 py-5 bg-white rounded shadow-sm">
              <img
                src="/images/earth.png"
                alt="No guides"
                style={{ width: "64px", opacity: 0.5, marginBottom: "15px" }}
              />
              <h4>No guides found</h4>
              <p className="text-muted mb-4">
                {language || availableOnly
                  ? "Try changing your search criteria."
                  : "No guide profiles have been added yet."}
              </p>
              <button onClick={handleReset} className="btn-nav-custom">
                View All Guides
              </button>
            </div>
          ) : (
            <div className="row">
              {guides.map((g) => (
                <div className="col-md-6 col-lg-4 mb-4" key={g.id}>
                  <motion.div
                    className="bg-white rounded shadow-sm h-100 d-flex flex-column"
                    style={{ overflow: "hidden", transition: "box-shadow 0.2s" }}
                    whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                  >
                    {/* Avatar / header band */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #01122a 0%, #0a3060 100%)",
                        padding: "28px 24px 20px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 12px",
                          fontSize: "2rem",
                        }}
                      >
                        🧭
                      </div>
                      <h5 className="text-white font-weight-bold m-0">{g.fullName}</h5>
                      <small className="text-white-50">{g.email}</small>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex-grow-1 d-flex flex-column">
                      {/* Availability badge */}
                      <span
                        className={`badge mb-3 ${g.isAvailable ? "badge-success" : "badge-secondary"}`}
                        style={{ fontSize: "12px", padding: "5px 10px", alignSelf: "flex-start" }}
                      >
                        {g.isAvailable ? "✓ Available" : "✗ Not Available"}
                      </span>

                      <div className="mb-2">
                        <small className="text-muted font-weight-bold">LANGUAGES</small>
                        <p className="mb-0 text-dark">{g.languages || "—"}</p>
                      </div>

                      <div className="mb-2">
                        <small className="text-muted font-weight-bold">SKILLS</small>
                        <p className="mb-0 text-dark" style={{ fontSize: "14px" }}>
                          {g.skills || "—"}
                        </p>
                      </div>

                      <div className="d-flex justify-content-between mt-2">
                        <span className="text-muted" style={{ fontSize: "13px" }}>
                          ⭐ {g.rating?.toFixed(1) ?? "0.0"}
                        </span>
                        <span className="text-muted" style={{ fontSize: "13px" }}>
                          {g.yearsExperience ?? 0} yrs experience
                        </span>
                      </div>

                      <div className="mt-auto pt-3 d-flex" style={{ gap: "8px" }}>
                        <Link
                          to={`/guides/${g.id}`}
                          className="btn-nav-custom flex-grow-1 text-center"
                          style={{ fontSize: "13px", padding: "7px 12px" }}
                        >
                          View Profile
                        </Link>
                        {isAdminOrStaff && (
                          <button
                            onClick={() => handleDelete(g.id)}
                            className="btn-outline-custom"
                            style={{ fontSize: "13px", padding: "7px 14px", color: "#c0392b", borderColor: "#c0392b" }}
                            title="Remove guide listing"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}