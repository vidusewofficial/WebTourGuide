import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDestinations, searchDestinations, filterDestinations } from "../../api/destinationApi";
import DestinationCard from "../../components/DestinationCard";

export default function DestinationList() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("ALL");

  async function loadAllDestinations() {
    setLoading(true);
    setError("");
    try {
      const data = await getDestinations();
      setDestinations(data);
    } catch (err) {
      console.error("Destination API error:", err);
      setError("Failed to load destinations. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllDestinations();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!keyword.trim()) {
      loadAllDestinations();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await searchDestinations(keyword.trim());
      setDestinations(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search destinations.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCategoryFilter(selectedCat) {
    setCategory(selectedCat);
    if (selectedCat === "ALL") {
      loadAllDestinations();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await filterDestinations(selectedCat);
      setDestinations(data);
    } catch (err) {
      console.error("Filter error:", err);
      setError("Failed to filter destinations.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setKeyword("");
    setCategory("ALL");
    loadAllDestinations();
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
              <h1 className="destinations-hero-title">Book Your Trip &amp; Explore</h1>
              <p className="destinations-hero-subtitle">
                Search top-rated tourist attractions, scenic locations, and memorable adventures.
              </p>
            </div>

            {/* Search form card */}
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
                        placeholder="Search destination..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text" style={{ background: "#041f3d" }}>
                          <img src="/images/earth.png" alt="Category" style={{ width: "18px" }} />
                        </div>
                      </div>
                      <select
                        className="form-control"
                        value={category}
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                      >
                        <option value="ALL">All Categories</option>
                        <option value="Beach">Beach</option>
                        <option value="Mountain">Mountain &amp; Hiking</option>
                        <option value="Historical">Historical &amp; Cultural</option>
                        <option value="City">City &amp; Nightlife</option>
                        <option value="Nature">Nature &amp; Wildlife</option>
                        <option value="Adventure">Adventure</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3 d-flex" style={{ gap: "8px" }}>
                    <button type="submit" className="btn-nav-custom flex-grow-1">
                      Search
                    </button>
                    {(keyword || category !== "ALL") && (
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

      {/* Destinations Grid */}
      <section className="layout_padding" style={{ backgroundColor: "#fbfbfb" }}>
        <div className="container">
          <div className="heading_container text-center mb-5">
            <h2>All Destinations</h2>
            <p>Explore our complete collection of holiday destinations for an unforgettable tour experience.</p>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading destinations...</span>
              </div>
              <p className="mt-3 text-muted">Loading destinations...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: "600px" }}>
              <p>{error}</p>
              <button onClick={loadAllDestinations} className="btn-nav-custom mt-2">
                Retry
              </button>
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center my-5 py-5 bg-white rounded shadow-sm">
              <img
                src="/images/earth.png"
                alt="No destinations"
                style={{ width: "64px", opacity: 0.5, marginBottom: "15px" }}
              />
              <h4>No destinations found</h4>
              <p className="text-muted mb-4">
                {keyword || category !== "ALL"
                  ? "Try changing your search terms or filter selection."
                  : "Start by adding your first destination!"}
              </p>
              <button onClick={handleReset} className="btn-nav-custom">
                View All Destinations
              </button>
            </div>
          ) : (
            <div className="row">
              {destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}