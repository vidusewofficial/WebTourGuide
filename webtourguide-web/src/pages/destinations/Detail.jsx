import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getDestinationById, updateDestination } from "../../api/destinationApi";
import { uploadImage } from "../../api/uploadApi";
import { useAuth } from "../../context/AuthContext";

export default function DestinationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mainUploading, setMainUploading] = useState(false);
  const fileInputRef = useRef(null);
  const mainImageInputRef = useRef(null);

  const defaultImage = "/images/b-1.jpg";
  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";

  async function loadDestination() {
    setLoading(true);
    setError("");
    try {
      const data = await getDestinationById(id);
      setDestination(data);
    } catch (err) {
      console.error("Destination details error:", err);
      setError("Failed to load destination details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadDestination();
    }
  }, [id]);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload the file to backend and get the URL back
      const imageUrl = await uploadImage(file);
      const fullUrl = `http://localhost:8080${imageUrl}`;

      const currentGallery = destination.galleryUrls || [];
      const updatedGallery = [...currentGallery, fullUrl];

      // If this is the first photo, also set it as the main image
      const isFirstPhoto = currentGallery.length === 0;
      const updatedData = {
        ...destination,
        galleryUrls: updatedGallery,
        imageUrl: isFirstPhoto ? fullUrl : destination.imageUrl,
      };

      await updateDestination(id, updatedData);
      setDestination(updatedData);
    } catch (err) {
      console.error("Failed to upload photo:", err);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleMainImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setMainUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      const fullUrl = `http://localhost:8080${imageUrl}`;
      const updatedData = { ...destination, imageUrl: fullUrl };
      await updateDestination(id, updatedData);
      setDestination(updatedData);
    } catch (err) {
      console.error("Failed to upload main image:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setMainUploading(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading destination...</span>
        </div>
        <p className="mt-3 text-muted">Loading destination details...</p>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="container py-5 my-5 text-center">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: "600px" }}>
          <h4>Destination Not Found</h4>
          <p>{error || "The destination you are looking for does not exist."}</p>
          <Link to="/destinations" className="btn-nav-custom mt-3 d-inline-block">
            Back to Destinations
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
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link
            to="/destinations"
            className="btn-outline-custom d-inline-flex align-items-center"
            style={{ fontSize: "14px", padding: "6px 16px" }}
          >
            &larr; Back to Destinations
          </Link>
        </div>

        <div className="row">
          {/* Main Destination Info */}
          <div className="col-lg-8 mb-4">
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
              {/* Clickable main hero image - admin only */}
              <div
                style={{ position: "relative", marginBottom: "1rem", cursor: isAdminOrStaff ? "pointer" : "default" }}
                onClick={() => isAdminOrStaff && mainImageInputRef.current.click()}
                title={isAdminOrStaff ? "Click to change main photo" : ""}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={mainImageInputRef}
                  style={{ display: "none" }}
                  onChange={handleMainImageChange}
                />
                <img
                  src={destination.imageUrl || defaultImage}
                  alt={destination.name}
                  className="detail-hero-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                  style={{ display: "block", width: "100%" }}
                />
                {/* Hover overlay - admin only */}
                {isAdminOrStaff && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.25s",
                    borderRadius: "inherit",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <span style={{
                      color: "#fff", fontSize: "1rem", fontWeight: "600",
                      background: "rgba(0,0,0,0.55)", padding: "8px 20px", borderRadius: "30px"
                    }}>
                      {mainUploading ? "Uploading..." : "📷 Change Main Photo"}
                    </span>
                  </div>
                )}
              </div>

              {destination.category && (
                <span className="destination-card-category mb-3">
                  {destination.category}
                </span>
              )}

              <h1 className="font-weight-bold text-dark mb-3" style={{ fontSize: "2.2rem" }}>
                {destination.name}
              </h1>

              <div className="destination-card-location mb-4" style={{ fontSize: "16px" }}>
                <img
                  src="/images/location.png"
                  alt="Location"
                  style={{ width: "20px", height: "20px" }}
                />
                <strong className="text-dark">{destination.location}</strong>
              </div>

              <h4 className="font-weight-bold mb-3" style={{ color: "#01122a" }}>
                Overview & Description
              </h4>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  color: "#555",
                  whiteSpace: "pre-line",
                }}
              >
                {destination.description ||
                  "Experience the beauty, rich history, and scenic views of this location. Perfect for family tours, solo adventures, and group explorations."}
              </p>

              {(destination.latitude || destination.longitude) && (
                <div className="mt-4 p-3 bg-light rounded border">
                  <h6 className="font-weight-bold text-dark mb-2">Geographic Coordinates</h6>
                  <p className="text-muted mb-0">
                    Latitude: <strong>{destination.latitude ?? "N/A"}</strong> | Longitude:{" "}
                    <strong>{destination.longitude ?? "N/A"}</strong>
                  </p>
                </div>
              )}

              {/* Photo Gallery Section */}
              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="font-weight-bold m-0" style={{ color: "#01122a" }}>
                    Photo Gallery
                  </h4>
                  {isAdminOrStaff && (
                    <div>
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <motion.button 
                        className="btn-outline-custom" 
                        style={{ padding: "6px 15px", fontSize: "14px" }}
                        onClick={() => fileInputRef.current.click()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "+ Add Photo"}
                      </motion.button>
                    </div>
                  )}
                </div>
                {destination.galleryUrls && destination.galleryUrls.length > 0 ? (
                  <div className="row">
                    {destination.galleryUrls.map((url, idx) => (
                      <div className="col-4 mb-3" key={idx}>
                        <img 
                          src={url} 
                          alt={`Gallery ${idx + 1}`} 
                          className="img-fluid rounded shadow-sm"
                          style={{ height: "120px", width: "100%", objectFit: "cover", cursor: "pointer" }}
                          onError={(e) => { e.target.src = defaultImage; }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted text-center py-4 bg-light rounded">
                    No photos in the gallery yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Tour Packages for this destination */}
            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <h4 className="font-weight-bold mb-2" style={{ color: "#01122a" }}>
                Available Tour Packages
              </h4>
              <p className="text-muted" style={{ fontSize: "14px" }}>
                Explore curated multi-day itineraries that include {destination.name}.
              </p>
              <hr />
              <Link
                to={`/packages?destination=${destination.id}`}
                className="btn-nav-custom d-block text-center"
              >
                View Packages for {destination.name} &rarr;
              </Link>
            </div>

            {/* Quick Contact Box */}
            <div className="p-4 rounded text-white" style={{ backgroundColor: "#01122a" }}>
              <h5 className="font-weight-bold text-white mb-2">Need Assistance?</h5>
              <p style={{ fontSize: "14px", color: "#ccc" }}>
                Speak with our travel support specialists 24/7.
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