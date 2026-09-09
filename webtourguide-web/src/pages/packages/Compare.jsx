import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { comparePackages } from "../../api/packageApi";

export default function PackageCompare() {
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ids = searchParams.get("ids");

  const defaultImage = "/images/b-1.jpg";

  useEffect(() => {
    async function loadComparedPackages() {
      if (!ids) {
        setLoading(false);
        setPackages([]);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await comparePackages(ids);
        setPackages(data);
      } catch (err) {
        console.error("Comparison error:", err);
        setError("Failed to fetch packages for comparison.");
      } finally {
        setLoading(false);
      }
    }
    loadComparedPackages();
  }, [ids]);

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
        {/* Navigation Breadcrumb */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <Link
            to="/packages"
            className="btn-outline-custom d-inline-flex align-items-center"
            style={{ fontSize: "14px", padding: "6px 16px" }}
          >
            &larr; Back to Packages
          </Link>
          <span className="text-muted" style={{ fontSize: "14px" }}>
            Comparing <strong>{packages.length}</strong> package(s)
          </span>
        </div>

        <div className="heading_container text-left mb-4" style={{ alignItems: "flex-start" }}>
          <h2 className="text-dark m-0">Compare Tour Packages</h2>
          <p className="text-muted mt-1">
            Compare features, pricing, itinerary duration, and group capacity side by side.
          </p>
        </div>

        {loading ? (
          <div className="text-center my-5 py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading comparison...</span>
            </div>
            <p className="mt-3 text-muted">Loading package comparison...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: "600px" }}>
            <p>{error}</p>
            <Link to="/packages" className="btn-nav-custom mt-2 d-inline-block">
              Back to Tour Packages
            </Link>
          </div>
        ) : !ids || packages.length === 0 ? (
          <div className="text-center my-5 py-5 bg-white rounded shadow-sm">
            <img
              src="/images/earth.png"
              alt="No packages"
              style={{ width: "64px", opacity: 0.5, marginBottom: "15px" }}
            />
            <h4>No packages selected to compare</h4>
            <p className="text-muted mb-4">
              Select 2 or more packages from the tour package catalogue to compare them.
            </p>
            <Link to="/packages" className="btn-nav-custom">
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="compare-table-container mb-4">
            <table className="package-compare-table">
              <thead>
                <tr>
                  <th style={{ minWidth: "160px" }}>Feature</th>
                  {packages.map((p) => (
                    <th key={p.id} style={{ minWidth: "240px", verticalAlign: "top" }}>
                      <img
                        src={p.imageUrl || p.destination?.imageUrl || defaultImage}
                        alt={p.title}
                        style={{
                          width: "100%",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "12px",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImage;
                        }}
                      />
                      <div className="font-weight-bold" style={{ color: "#01122a", fontSize: "1.15rem" }}>
                        {p.title}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Destination</td>
                  {packages.map((p) => (
                    <td key={p.id}>
                      <strong>{p.destination?.name}</strong>
                      <span className="d-block text-muted" style={{ fontSize: "13px" }}>
                        {p.destination?.location}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Category</td>
                  {packages.map((p) => (
                    <td key={p.id}>
                      <span className="destination-card-category m-0">
                        {p.destination?.category || "Tour"}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Duration</td>
                  {packages.map((p) => (
                    <td key={p.id}>
                      <span className="package-duration-badge">
                        ⏱ {p.durationDays} {p.durationDays === 1 ? "Day" : "Days"}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Price per Person</td>
                  {packages.map((p) => (
                    <td key={p.id}>
                      <span className="package-price-badge">
                        ${p.price}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Max Participants</td>
                  {packages.map((p) => (
                    <td key={p.id}>
                      👥 {p.maxParticipants ? `${p.maxParticipants} persons` : "10 persons"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Description</td>
                  {packages.map((p) => (
                    <td key={p.id} style={{ fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
                      {p.description || "Scenic tour and excursion package."}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Status</td>
                  {packages.map((p) => (
                    <td key={p.id}>
                      {p.active ? (
                        <span className="badge badge-success px-2 py-1">Available</span>
                      ) : (
                        <span className="badge badge-secondary px-2 py-1">Inactive</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Action</td>
                  {packages.map((p) => (
                    <td key={p.id}>
                      <Link
                        to={`/packages/${p.id}`}
                        className="btn-nav-custom d-inline-block text-center"
                        style={{ fontSize: "13px", padding: "8px 16px" }}
                      >
                        View Details &rarr;
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
