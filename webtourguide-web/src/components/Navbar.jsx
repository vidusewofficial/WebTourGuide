import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";

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
              <ul className="navbar-nav mr-lg-3">
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
