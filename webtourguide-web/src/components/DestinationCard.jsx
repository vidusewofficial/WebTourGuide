import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function DestinationCard({ destination, onDelete }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const defaultImage = "/images/b-1.jpg";

  function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${destination.name}"? This action cannot be undone.`)) {
      if (onDelete) {
        onDelete(destination.id);
      }
    }
  }

  return (
    <motion.div 
      className="col-md-6 col-lg-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -10 }}
    >
      <div className="destination-card">
        <img
          src={destination.imageUrl || defaultImage}
          alt={destination.name}
          className="destination-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />

        <div className="destination-card-body">
          {destination.category && (
            <span className="destination-card-category">{destination.category}</span>
          )}

          <h4 className="font-weight-bold" style={{ color: "#01122a", fontSize: "1.25rem" }}>
            {destination.name}
          </h4>

          <div className="destination-card-location">
            <img
              src="/images/location.png"
              alt="Location"
              style={{ width: "16px", height: "16px" }}
            />
            <span>{destination.location}</span>
          </div>

          <p
            className="text-muted"
            style={{
              fontSize: "14px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "15px",
            }}
          >
            {destination.description || "Explore this wonderful destination and its attractions."}
          </p>

          <div className="mt-auto pt-2 border-top d-flex align-items-center" style={{ gap: "8px" }}>
            <Link
              to={`/destinations/${destination.id}`}
              className="btn-nav-custom flex-grow-1 text-center"
              style={{ fontSize: "14px", padding: "8px 12px" }}
            >
              View Details
            </Link>

            {isAdmin && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-outline-danger"
                style={{ borderRadius: "20px", padding: "6px 14px", fontSize: "13px", fontWeight: "600" }}
                title="Delete this destination"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
