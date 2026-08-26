import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroSlider from "../components/HeroSlider";
import DestinationCard from "../components/DestinationCard";
import { getDestinations } from "../api/destinationApi";

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPopularDestinations() {
      try {
        const data = await getDestinations();
        // Just show the first 6 destinations on the homepage as "popular"
        setDestinations(data.slice(0, 6)); 
      } catch (err) {
        console.error("Failed to load destinations:", err);
        setError("Could not load popular destinations.");
      } finally {
        setLoading(false);
      }
    }
    loadPopularDestinations();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="hero_area">
        <HeroSlider />
      </div>

      <section className="layout_padding" style={{ backgroundColor: "#01122a" }}>
        <div className="container py-5">
          <motion.div 
            className="heading_container text-center mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ color: "#ffffff" }}>Popular Destinations</h2>
            <p style={{ color: "rgba(255,255,255,0.8)" }}>Handpicked holiday destinations for an unforgettable tour experience.</p>
          </motion.div>

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading destinations...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: "600px" }}>
              {error}
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center my-5">
              <p style={{ color: "rgba(255,255,255,0.8)" }}>No popular destinations available right now.</p>
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
