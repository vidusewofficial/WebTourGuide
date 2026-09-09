import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPackages, searchPackages, deletePackage } from "../../api/packageApi";
import { useAuth } from "../../context/AuthContext";

export default function PackageList() {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState([]);

  const defaultImage = "/images/b-1.jpg";

  async function loadAllPackages() {
    setLoading(true);
    setError("");
    try {
      const data = await getPackages();
      setPackages(data);
    } catch (err) {
      console.error("Package API error:", err);
      setError("Failed to load tour packages. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllPackages();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!keyword.trim()) {
      loadAllPackages();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const results = await searchPackages(keyword.trim());
      setPackages(results);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search packages.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setKeyword("");
    loadAllPackages();
  }

  async function handleDeletePackage(id) {
    try {
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
      setSelected((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      console.error("Delete package error:", err);
      alert("Failed to delete tour package. Please try again.");
    }
  }

  function toggleSelect(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3)
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero banner with search form */}
      <div className="destinations-hero">
        <div className="destinations-hero-overlay">
          <div className="container">
            <div className="text-center mb-4">
              <h1 className="destinations-hero-title">Tour Packages &amp; Experiences</h1>
              <p className="destinations-hero-subtitle">
                Compare curated holiday packages, multi-day itineraries, and group travel deals.
              </p>
            </div>

            {/* Search form card */}
            <div className="destinations-search-card" style={{ maxWidth: "700px", margin: "30px auto 0" }}>
              <form onSubmit={handleSearch}>
                <div className="row align-items-center">
                  <div className="col-md-8 mb-3 mb-md-0">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text" style={{ background: "#041f3d" }}>
                          <img src="/images/search-icon.png" alt="Search" style={{ width: "18px" }} />
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search packages by title or keyword..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 d-flex" style={{ gap: "8px" }}>
                    <button type="submit" className="btn-nav-custom flex-grow-1">
                      Search
                    </button>
                    {keyword && (
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

      {/* Floating compare bar when packages are selected */}
      {selected.length > 1 && (
        <div className="compare-floating-bar">
          <span>
            <strong>{selected.length}</strong> packages selected for comparison
          </span>
          <Link
            to={`/packages/compare?ids=${selected.join(",")}`}
            className="compare-bar-btn"
          >
            Compare Now &rarr;
          </Link>
          <button
            onClick={() => setSelected([])}
            style={{
              background: "transparent",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              fontSize: "14px",
              marginLeft: "4px",
            }}
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* Packages Grid */}
      <section className="layout_padding" style={{ backgroundColor: "#fbfbfb" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0">Available Packages</h2>
              <p className="text-muted mt-1">
                Select up to 3 packages with the checkbox to compare them side-by-side.
              </p>
            </div>

            <div className="d-flex align-items-center flex-wrap mt-3 mt-md-0" style={{ gap: "10px" }}>
              {selected.length > 1 && (
                <Link
                  to={`/packages/compare?ids=${selected.join(",")}`}
                  className="btn-outline-custom"
                >
                  Compare ({selected.length}) Selected
                </Link>
              )}
              {isAdminOrStaff && (
                <Link to="/admin/packages/new" className="btn-nav-custom">
                  + Add Tour Package
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading packages...</span>
              </div>
              <p className="mt-3 text-muted">Loading tour packages...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: "600px" }}>
              <p>{error}</p>
              <button onClick={loadAllPackages} className="btn-nav-custom mt-2">
                Retry
              </button>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center my-5 py-5 bg-white rounded shadow-sm">
              <img
                src="/images/earth.png"
                alt="No packages"
                style={{ width: "64px", opacity: 0.5, marginBottom: "15px" }}
              />
              <h4>No tour packages found</h4>
              <p className="text-muted mb-4">
                {keyword
                  ? "Try searching with different keywords."
                  : "Check back later for new curated travel packages!"}
              </p>
              <button onClick={handleReset} className="btn-nav-custom">
                View All Packages
              </button>
            </div>
          ) : (
            <div className="row">
              {packages.map((pkg) => {
                const isSelected = selected.includes(pkg.id);
                return (
                  <motion.div
                    className="col-md-6 col-lg-4 mb-4"
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="package-card"
                      style={{
                        border: isSelected ? "2px solid #f07b26" : "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {/* Compare checkbox */}
                      <label className="package-select-checkbox" title="Select to compare">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(pkg.id)}
                        />
                        <span>{isSelected ? "Selected" : "Compare"}</span>
                      </label>

                      {/* Package / Destination Image */}
                      <img
                        src={pkg.imageUrl || pkg.destination?.imageUrl || defaultImage}
                        alt={pkg.title}
                        className="package-card-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                      />

                      <div className="package-card-body">
                        {/* Destination & Duration badges */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="destination-card-category">
                            {pkg.destination?.category || "Tour"}
                          </span>
                          <span className="package-duration-badge">
                            ⏱ {pkg.durationDays} {pkg.durationDays === 1 ? "Day" : "Days"}
                          </span>
                        </div>

                        <h4
                          className="font-weight-bold mb-2"
                          style={{ color: "#01122a", fontSize: "1.2rem" }}
                        >
                          {pkg.title}
                        </h4>

                        <div className="destination-card-location mb-2">
                          <img
                            src="/images/location.png"
                            alt="Location"
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span>
                            {pkg.destination?.name} &middot; {pkg.destination?.location}
                          </span>
                        </div>

                        <p
                          className="text-muted"
                          style={{
                            fontSize: "14px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            marginBottom: "15px",
                          }}
                        >
                          {pkg.description || "Exciting tour package packed with memorable activities."}
                        </p>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <span style={{ fontSize: "12px", color: "#888", display: "block" }}>
                              Price
                            </span>
                            <span className="package-price-badge">
                              ${pkg.price}
                            </span>
                            <small className="text-muted ml-1">/ person</small>
                          </div>
                          {pkg.maxParticipants && (
                            <div className="text-right">
                              <span style={{ fontSize: "12px", color: "#888", display: "block" }}>
                                Max Group
                              </span>
                              <span style={{ fontSize: "13px", fontWeight: "600", color: "#01122a" }}>
                                👥 {pkg.maxParticipants} max
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto pt-2 border-top d-flex align-items-center" style={{ gap: "8px" }}>
                          <Link
                            to={`/packages/${pkg.id}`}
                            className="btn-nav-custom flex-grow-1 text-center"
                            style={{ fontSize: "14px", padding: "8px 12px" }}
                          >
                            View Details &rarr;
                          </Link>
                          {user?.role === "ADMIN" && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              style={{ borderRadius: "20px", padding: "6px 14px", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}
                              title="Delete this package"
                              onClick={() => {
                                if (window.confirm(`Delete "${pkg.title}"? This cannot be undone.`)) {
                                  handleDeletePackage(pkg.id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
