import { motion } from "framer-motion";
import ServicesSection from "../components/ServicesSection";

export default function Services() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Services Hero Header */}
      <div className="destinations-hero">
        <div className="destinations-hero-overlay">
          <div className="container text-center">
            <h1 className="destinations-hero-title">Our Premium Travel Services</h1>
            <p className="destinations-hero-subtitle">
              Comprehensive travel planning, certified local guides, luxury stays, and 24/7 tourist support.
            </p>
          </div>
        </div>
      </div>

      {/* Services Main Section */}
      <div style={{ backgroundColor: "#f9f9fb", minHeight: "60vh" }}>
        <ServicesSection />
      </div>
    </motion.div>
  );
}
