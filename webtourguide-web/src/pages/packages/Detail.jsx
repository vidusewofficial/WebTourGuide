import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getPackage, updatePackage } from "../../api/packageApi";
import { uploadImage } from "../../api/uploadApi";
import { useAuth } from "../../context/AuthContext";

export default function PackageDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mainUploading, setMainUploading] = useState(false);

  const mainImageInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const defaultImage = "/images/b-1.jpg";
  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";

  useEffect(() => {
    async function loadPackage() {
      setLoading(true);
      setError("");
      try {
        const data = await getPackage(id);
        setPkg(data);
      } catch (err) {
        console.error("Package detail error:", err);
        setError("Failed to load tour package details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadPackage();
  }, [id]);

  // Build a request payload from current pkg state + overrides
  function buildRequest(overrides) {
    return {
      destinationId: pkg.destination?.id,
      title: pkg.title,
      description: pkg.description,
      durationDays: pkg.durationDays,
      price: pkg.price,
      maxParticipants: pkg.maxParticipants,
      active: pkg.active,
      imageUrl: pkg.imageUrl,
      galleryUrls: pkg.galleryUrls || [],
      ...overrides,
    };
  }

  async function handleMainImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setMainUploading(true);
    try {
      const url = await uploadImage(file);
      const fullUrl = `http://localhost:8080${url}`;
      const updated = await updatePackage(id, buildRequest({ imageUrl: fullUrl }));
      setPkg(updated);
    } catch (err) {
      console.error("Failed to upload main image:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setMainUploading(false);
      e.target.value = "";
    }
  }

  async function handleGalleryAdd(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const fullUrl = `http://localhost:8080${url}`;
      const currentGallery = pkg.galleryUrls || [];
      const newGallery = [...currentGallery, fullUrl];
      // If no main image yet, set this as the main image too
      const newImageUrl = pkg.imageUrl || fullUrl;
      const updated = await updatePackage(
        id,
        buildRequest({ galleryUrls: newGallery, imageUrl: newImageUrl })
      );
      setPkg(updated);
    } catch (err) {
      console.error("Failed to upload gallery photo:", err);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleGalleryRemove(urlToRemove) {
    if (!window.confirm("Remove this photo from the gallery?")) return;
    try {
      const newGallery = (pkg.galleryUrls || []).filter((u) => u !== urlToRemove);
      const updated = await updatePackage(id, buildRequest({ galleryUrls: newGallery }));
      setPkg(updated);
    } catch (err) {
      console.error("Failed to remove gallery photo:", err);
      alert("Failed to remove photo. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading package...</span>
        </div>
        <p className="mt-3 text-muted">Loading tour package details...</p>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="container py-5 my-5 text-center">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: "600px" }}>
          <h4>Tour Package Not Found</h4>
          <p>{error || "The package you are looking for does not exist."}</p>
          <Link to="/packages" className="btn-nav-custom mt-3 d-inline-block">
            Back to Tour Packages
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = pkg.imageUrl || pkg.destination?.imageUrl || defaultImage;

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
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            to="/packages"
            className="btn-outline-custom d-inline-flex align-items-center"
            style={{ fontSize: "14px", padding: "6px 16px" }}
          >
            &larr; Back to Packages
          </Link>
        </div>

        <div className="row">
          {/* Main Panel */}
          <div className="col-lg-8 mb-4">
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">

              {/* Clickable Hero / Profile Image */}
              <div
                style={{
                  position: "relative",
                  marginBottom: "1.5rem",
                  cursor: isAdminOrStaff ? "pointer" : "default",
                }}
                onClick={() => isAdminOrStaff && mainImageInputRef.current.click()}
                title={isAdminOrStaff ? "Click to change profile photo" : ""}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={mainImageInputRef}
                  style={{ display: "none" }}
                  onChange={handleMainImageChange}
                />
                <img
                  src={heroImage}
                  alt={pkg.title}
                  className="detail-hero-img"
                  style={{ display: "block", width: "100%" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
                {/* Hover overlay for admin */}
                {isAdminOrStaff && (
                  <div
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0, transition: "opacity 0.25s",
                      borderRadius: "inherit",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                  >
                    <span
                      style={{
                        color: "#fff", fontSize: "1rem", fontWeight: "600",
                        background: "rgba(0,0,0,0.55)", padding: "8px 20px", borderRadius: "30px",
                      }}
                    >
                      {mainUploading ? "Uploading..." : "📷 Change Profile Photo"}
                    </span>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="d-flex align-items-center flex-wrap mb-3" style={{ gap: "10px" }}>
                {pkg.destination?.category && (
                  <span className="destination-card-category m-0">
                    {pkg.destination.category}
                  </span>
                )}
                <span className="package-duration-badge">
                  ⏱ {pkg.durationDays} {pkg.durationDays === 1 ? "Day" : "Days"} Tour
                </span>
                {pkg.active && (
                  <span
                    style={{
                      background: "#e6f7ed", color: "#0d8a4f",
                      fontSize: "12px", fontWeight: "600",
                      padding: "3px 10px", borderRadius: "15px",
                    }}
                  >
                    ✓ Active
                  </span>
                )}
              </div>

              <h1 className="font-weight-bold text-dark mb-3" style={{ fontSize: "2.2rem" }}>
                {pkg.title}
              </h1>

              <div className="destination-card-location mb-4" style={{ fontSize: "16px" }}>
                <img
                  src="/images/location.png"
                  alt="Location"
                  style={{ width: "20px", height: "20px" }}
                />
                <strong className="text-dark">
                  {pkg.destination?.name} &middot; {pkg.destination?.location}
                </strong>
              </div>

              <hr />

              {/* Stats */}
              <div className="row my-4 text-center">
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="p-3 bg-light rounded border">
                    <span className="text-muted d-block mb-1" style={{ fontSize: "13px" }}>Duration</span>
                    <h5 className="font-weight-bold text-dark m-0">
                      {pkg.durationDays} {pkg.durationDays === 1 ? "Day" : "Days"}
                    </h5>
                  </div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="p-3 bg-light rounded border">
                    <span className="text-muted d-block mb-1" style={{ fontSize: "13px" }}>Price per Person</span>
                    <h5 className="font-weight-bold m-0" style={{ color: "#0d8a4f" }}>${pkg.price}</h5>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded border">
                    <span className="text-muted d-block mb-1" style={{ fontSize: "13px" }}>Max Participants</span>
                    <h5 className="font-weight-bold text-dark m-0">{pkg.maxParticipants || "10"} Persons</h5>
                  </div>
                </div>
              </div>

              <h4 className="font-weight-bold mb-3" style={{ color: "#01122a" }}>
                Package Overview &amp; Itinerary
              </h4>
              <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#555", whiteSpace: "pre-line" }}>
                {pkg.description ||
                  "Immerse yourself in this curated tour experience with professional guides, scenic excursions, and seamless travel logistics."}
              </p>

              {/* Photo Gallery */}
              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="font-weight-bold m-0" style={{ color: "#01122a" }}>
                    Photo Gallery
                  </h4>
                  {isAdminOrStaff && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={galleryInputRef}
                        style={{ display: "none" }}
                        onChange={handleGalleryAdd}
                      />
                      <motion.button
                        className="btn-outline-custom"
                        style={{ padding: "6px 15px", fontSize: "14px" }}
                        onClick={() => galleryInputRef.current.click()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "+ Add Photo"}
                      </motion.button>
                    </div>
                  )}
                </div>

                {pkg.galleryUrls && pkg.galleryUrls.length > 0 ? (
                  <div className="row">
                    {pkg.galleryUrls.map((url, idx) => (
                      <div className="col-4 mb-3" key={idx} style={{ position: "relative" }}>
                        <img
                          src={url}
                          alt={`Gallery ${idx + 1}`}
                          className="img-fluid rounded shadow-sm"
                          style={{ height: "120px", width: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.src = defaultImage; }}
                        />
                        {isAdminOrStaff && (
                          <button
                            type="button"
                            onClick={() => handleGalleryRemove(url)}
                            style={{
                              position: "absolute", top: "6px", right: "12px",
                              background: "rgba(200,0,0,0.75)", border: "none",
                              color: "#fff", borderRadius: "50%",
                              width: "22px", height: "22px",
                              fontSize: "13px", lineHeight: "20px",
                              cursor: "pointer", padding: 0,
                            }}
                            title="Remove photo"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted text-center py-4 bg-light rounded">
                    No photos in the gallery yet.{isAdminOrStaff && " Click \"+ Add Photo\" to upload."}
                  </div>
                )}
              </div>

              {/* Destination Link */}
              {pkg.destination && (
                <div className="mt-5 p-4 rounded border" style={{ backgroundColor: "#f8fafc" }}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h5 className="font-weight-bold text-dark mb-1">
                        Featured Destination: {pkg.destination.name}
                      </h5>
                      <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                        Location: {pkg.destination.location}
                      </p>
                    </div>
                    <Link
                      to={`/destinations/${pkg.destination.id}`}
                      className="btn-outline-custom"
                      style={{ fontSize: "13px" }}
                    >
                      View Destination &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded shadow-sm mb-4">
              <h4 className="font-weight-bold mb-3" style={{ color: "#01122a" }}>
                Package Summary
              </h4>
              <hr />
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Price per person:</span>
                <h3 className="font-weight-bold m-0" style={{ color: "#0d8a4f" }}>${pkg.price}</h3>
              </div>
              <div className="mb-2">
                <span className="text-muted d-block" style={{ fontSize: "13px" }}>Duration:</span>
                <strong className="text-dark">{pkg.durationDays} day(s)</strong>
              </div>
              <div className="mb-4">
                <span className="text-muted d-block" style={{ fontSize: "13px" }}>Destination:</span>
                <strong className="text-dark">
                  {pkg.destination?.name} ({pkg.destination?.location})
                </strong>
              </div>
              <Link
                to={`/packages/compare?ids=${pkg.id}`}
                className="btn-outline-custom d-block text-center mt-2"
                style={{ width: "100%" }}
              >
                Compare with Other Packages
              </Link>
            </div>

            {/* Quick Contact Box */}
            <div className="p-4 rounded text-white" style={{ backgroundColor: "#01122a" }}>
              <h5 className="font-weight-bold text-white mb-2">Have Questions?</h5>
              <p style={{ fontSize: "14px", color: "#ccc" }}>
                Our travel experts are ready to assist you anytime.
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
