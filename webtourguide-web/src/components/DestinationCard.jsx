import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function DestinationCard({ destination }) {
  const defaultImage = "/images/b-1.jpg";

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

          <div className="mt-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/destinations/${destination.id}`}
                className="btn-nav-custom d-block text-center"
              >
                View Details
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
