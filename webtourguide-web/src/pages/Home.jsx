import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroSlider from "../components/HeroSlider";
import DestinationCard from "../components/DestinationCard";
import { getDestinations } from "../api/destinationApi";
import { getPackages } from "../api/packageApi";

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const destData = await getDestinations();
        setDestinations(Array.isArray(destData) ? destData.slice(0, 6) : []);
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setError(err.message || "Failed to load API data");
        setDestinations([]);
      } finally {
        setLoadingDestinations(false);
      }

      try {
        const pkgData = await getPackages();
        setPackages(Array.isArray(pkgData) ? pkgData.slice(0, 3) : []);
      } catch (err) {
        console.error("Failed to load tour packages:", err);
        setError(err.message || "Failed to load API data");
        setPackages([]);
      } finally {
        setLoadingPackages(false);
      }
    }

    loadData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
    >
      {/* 1. Top Half-Circle Hero Slider Section */}
      <div className="hero_area">
        <HeroSlider />
      </div>

      {error && (
        <div className="container mt-4">
          <div className="alert alert-danger">
            <strong>API Error: </strong> {error}. Please ensure the backend is running on port 8080.
          </div>
        </div>
      )}

      {/* 2. Popular Destinations Section */}
      <section className="layout_padding" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0" style={{ fontSize: "2rem" }}>Popular Destinations</h2>
              <p className="text-muted mt-1">Handpicked holiday destinations for an unforgettable tour experience.</p>
            </div>
            <Link to="/destinations" className="btn-outline-custom mt-3 mt-md-0">
              View All Destinations &rarr;
            </Link>
          </div>

          {loadingDestinations ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading destinations...</span>
              </div>
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center my-5 py-4 bg-white rounded shadow-sm">
              <p className="text-muted m-0">No destinations available at the moment.</p>
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

      {/* 3. Featured Tour Packages Section */}
      <section className="layout_padding" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0" style={{ fontSize: "2rem" }}>Featured Tour Packages</h2>
              <p className="text-muted mt-1">Curated multi-day itineraries with expert local guides and guaranteed best prices.</p>
            </div>
            <Link to="/packages" className="btn-nav-custom mt-3 mt-md-0">
              Explore All Packages &rarr;
            </Link>
          </div>

          {loadingPackages ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading packages...</span>
              </div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center my-5 py-4 bg-light rounded border">
              <p className="text-muted m-0">No tour packages available at the moment.</p>
            </div>
          ) : (
            <div className="row">
              {packages.map((pkg) => (
                <motion.div
                  className="col-md-6 col-lg-4 mb-4"
                  key={pkg.id}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="package-card shadow-sm h-100">
                    <img
                      src={pkg.imageUrl || pkg.destination?.imageUrl || "/images/b-1.jpg"}
                      alt={pkg.title}
                      className="package-card-img"
                      onError={(e) => {
                        e.target.src = "/images/b-1.jpg";
                      }}
                    />
                    <div className="package-card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="destination-card-category">
                          {pkg.destination?.category || "Tour"}
                        </span>
                        <span className="package-duration-badge">
                          ⏱ {pkg.durationDays} {pkg.durationDays === 1 ? "Day" : "Days"}
                        </span>
                      </div>

                      <h4 className="font-weight-bold mb-2" style={{ color: "#01122a", fontSize: "1.2rem" }}>
                        {pkg.title}
                      </h4>

                      <div className="destination-card-location mb-2">
                        <img src="/images/location.png" alt="Location" style={{ width: "16px", height: "16px" }} />
                        <span>{pkg.destination?.name} &middot; {pkg.destination?.location}</span>
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
                        {pkg.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <span style={{ fontSize: "12px", color: "#888", display: "block" }}>Price</span>
                          <span className="package-price-badge">${pkg.price}</span>
                          <small className="text-muted ml-1">/ person</small>
                        </div>
                        <div className="text-right">
                          <span style={{ fontSize: "12px", color: "#888", display: "block" }}>Group Capacity</span>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "#01122a" }}>
                            👥 {pkg.maxParticipants} max
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto pt-2 border-top">
                        <Link to={`/packages/${pkg.id}`} className="btn-nav-custom d-block text-center">
                          View Details &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
