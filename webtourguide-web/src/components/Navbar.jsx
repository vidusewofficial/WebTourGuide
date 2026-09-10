import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";
  const isBookingActive = location.pathname.startsWith("/bookings") || location.pathname === "/admin/bookings";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsBookingOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header_section" style={{ zIndex: 100, position: "relative" }}>
      <div className="container">
        <nav className="navbar navbar-expand-lg custom_nav-container pt-3">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/images/earth.png"
              alt="Logo"
              style={{ width: "32px", height: "32px", marginRight: "10px" }}
            />
            <span>Web Based Tourguide</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-controls="navbarSupportedContent"
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
            id="navbarSupportedContent"
          >
            <div className="d-flex ml-auto flex-column flex-lg-row align-items-lg-center">
              <ul className="navbar-nav mr-lg-3" style={{ alignItems: "center" }}>
                <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
                  <Link className="nav-link" to="/" onClick={() => setIsNavOpen(false)}>
                    Home
                  </Link>
                </li>
                <li className={`nav-item ${location.pathname === "/destinations" ? "active" : ""}`}>
                  <Link className="nav-link" to="/destinations" onClick={() => setIsNavOpen(false)}>
                    Destinations
                  </Link>
                </li>
                <li className={`nav-item ${location.pathname.startsWith("/packages") ? "active" : ""}`}>
                  <Link className="nav-link" to="/packages" onClick={() => setIsNavOpen(false)}>
                    Packages
                  </Link>
                </li>
                <li className={`nav-item ${location.pathname.startsWith("/guides") ? "active" : ""}`}>
                  <Link className="nav-link" to="/guides" onClick={() => setIsNavOpen(false)}>
                    Guides
                  </Link>
                </li>
                <li className={`nav-item ${location.pathname === "/services" ? "active" : ""}`}>
                  <Link className="nav-link" to="/services" onClick={() => setIsNavOpen(false)}>
                    Services
                  </Link>
                </li>

                {/* ── Bookings dropdown (only when logged in) ── */}
                {user && (
                  <li
                    className={`nav-item ${isBookingActive ? "active" : ""}`}
                    style={{ position: "relative" }}
                    ref={dropdownRef}
                  >
                    <button
                      className="nav-link"
                      onClick={() => setIsBookingOpen((v) => !v)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "8px 12px",
                        whiteSpace: "nowrap",
                        color: "inherit",
                        fontWeight: isBookingActive ? 700 : "inherit",
                      }}
                    >
                      Bookings
                      <svg
                        width="10" height="10" viewBox="0 0 10 10"
                        style={{
                          transform: isBookingOpen ? "rotate(180deg)" : "rotate(0)",
                          transition: "transform 0.2s",
                          marginLeft: 2,
                        }}
                      >
                        <path d="M1 3 L5 7 L9 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </button>

                    {/* Dropdown panel */}
                    {isBookingOpen && (
                      <div style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        background: "#0c1730",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 8,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                        minWidth: 185,
                        zIndex: 9999,
                        overflow: "hidden",
                      }}>

                        <Link
                          to="/bookings/new"
                          onClick={() => { setIsNavOpen(false); setIsBookingOpen(false); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "12px 18px",
                            color: location.pathname === "/bookings/new" ? "#f8c146" : "#e0e6f0",
                            textDecoration: "none", fontSize: 14,
                            fontWeight: location.pathname === "/bookings/new" ? 700 : 400,
                            borderBottom: "1px solid rgba(255,255,255,0.07)",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <span>📅</span> Book Now
                        </Link>

                        <Link
                          to="/bookings/my"
                          onClick={() => { setIsNavOpen(false); setIsBookingOpen(false); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "12px 18px",
                            color: location.pathname === "/bookings/my" ? "#f8c146" : "#e0e6f0",
                            textDecoration: "none", fontSize: 14,
                            fontWeight: location.pathname === "/bookings/my" ? 700 : 400,
                            borderBottom: isAdminOrStaff ? "1px solid rgba(255,255,255,0.07)" : "none",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <span>📋</span> My Bookings
                        </Link>

                        {isAdminOrStaff && (
                          <Link
                            to="/admin/bookings"
                            onClick={() => { setIsNavOpen(false); setIsBookingOpen(false); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 10,
                              padding: "12px 18px",
                              color: location.pathname === "/admin/bookings" ? "#f8c146" : "#e0e6f0",
                              textDecoration: "none", fontSize: 14,
                              fontWeight: location.pathname === "/admin/bookings" ? 700 : 400,
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <span>🗂️</span> All Bookings
                          </Link>
                        )}
                      </div>
                    )}
                  </li>
                )}
              </ul>

              <div className="d-flex align-items-center flex-wrap" style={{ gap: "10px" }}>
                {user ? (
                  <>
                    <span className="d-none d-lg-inline text-dark font-weight-bold mr-2">
                      Hi, {user.fullName || "User"}
                      <span className="auth-badge">{user.role}</span>
                    </span>
                    <button
                      onClick={() => {
                        setIsNavOpen(false);
                        handleLogout();
                      }}
                      className="btn-outline-custom"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn-outline-custom"
                      onClick={() => setIsNavOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn-nav-custom"
                      onClick={() => setIsNavOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
