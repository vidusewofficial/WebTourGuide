import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Declarative nav structure shared by every user type (guest, TOURIST,
 * TOUR_GUIDE, STAFF, ADMIN). Each top-level entry is either a plain "link"
 * or a "dropdown" of links. `roles` gates visibility — omitted/null means
 * visible to everyone, including logged-out guests. Dropdown items may set
 * their own `roles` to further narrow a subset of an otherwise-shared menu.
 * Add a new page to the site by adding one entry here rather than touching
 * markup, so every role's menu stays generated from a single source.
 */
const NAV_CONFIG = [
  { type: "link", to: "/", label: "Home", match: (p) => p === "/" },
  { type: "link", to: "/destinations", label: "Destinations", match: (p) => p === "/destinations" },
  { type: "link", to: "/packages", label: "Packages", match: (p) => p.startsWith("/packages") },
  {
    type: "dropdown",
    id: "guides",
    label: "Guides",
    match: (p) => p.startsWith("/guides") || p === "/admin/guides/new",
    items: [
      { to: "/guides", icon: "🧭", label: "Browse Guides" },
      { to: "/guides/apply", icon: "🎓", label: "Become a Guide", roles: ["TOURIST"] },
      { to: "/admin/guides/new", icon: "➕", label: "Add Guide", roles: ["ADMIN", "STAFF"] },
    ],
  },
  {
    type: "dropdown",
    id: "bookings",
    label: "Bookings",
    roles: ["TOURIST", "ADMIN", "STAFF"],
    match: (p) =>
      p.startsWith("/bookings") ||
      p === "/admin/bookings" ||
      p.startsWith("/trips"),
    items: [
      { to: "/bookings/new",   icon: "📅", label: "Book Now",     roles: ["TOURIST", "ADMIN", "STAFF"] },
      { to: "/bookings/my",    icon: "📋", label: "My Bookings",  roles: ["TOURIST"] },
      { to: "/admin/bookings", icon: "🗂️", label: "All Bookings", roles: ["ADMIN", "STAFF"] },
      { to: "/trips",          icon: "🗺️", label: "Plan Trip",    roles: ["TOURIST"] },
    ],
  },
  {
    type: "link",
    to: "/support/my",
    label: "Support",
    roles: ["TOURIST"],
    match: (p) => p.startsWith("/support"),
  },
  {
    type: "dropdown",
    id: "admin",
    label: "Admin",
    roles: ["ADMIN", "STAFF"],
    match: (p) =>
      [
        "/staff/support",
        "/admin/destinations/new",
        "/admin/packages/new",
        "/admin/guide-applications",
        "/admin/users",
      ].includes(p),
    items: [
      { to: "/staff/support",            icon: "🎫", label: "Support Queue" },
      { to: "/admin/destinations/new",   icon: "📍", label: "Add Destination" },
      { to: "/admin/packages/new",       icon: "📦", label: "Add Package" },
      { to: "/admin/guide-applications", icon: "📝", label: "Guide Applications", roles: ["ADMIN"] },
      { to: "/admin/users",              icon: "👥", label: "Manage Users",        roles: ["ADMIN"] },
    ],
  },
  // Services sits at position 7+ so it always falls into the "More" overflow dropdown
  { type: "link", to: "/services", label: "Services", match: (p) => p === "/services" },
];


/** SVG icons keyed by nav label */
const NAV_ICONS = {
  Home: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Destinations: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Packages: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  Guides: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Services: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M4.93 19.07l-1.41 1.41M19.07 19.07l-1.41-1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12H4M20 12h2" />
    </svg>
  ),
  Bookings: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  "Plan Trip": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  ),
  Support: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.43 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Admin: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  More: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
};

/** True if `entry` (a top-level item or a dropdown's sub-item) is visible to `role`. */
function isVisible(entry, role) {
  return !entry.roles || (role && entry.roles.includes(role));
}

/** A top-level nav item that opens a dropdown panel of links. */
function NavDropdown({ id, label, active, openId, setOpenId, children }) {
  const isOpen = openId === id;
  return (
    <li className={`wtg-nav-item ${active ? "active" : ""}`} style={{ position: "relative" }}>
      <button
        type="button"
        className={`wtg-nav-link wtg-nav-dropdown-toggle ${active ? "active" : ""}`}
        onClick={() => setOpenId(isOpen ? null : id)}
      >
        <span className="wtg-nav-icon">{NAV_ICONS[label]}</span>
        {label}
        <svg
          className={`wtg-chevron ${isOpen ? "open" : ""}`}
          width="10" height="10" viewBox="0 0 10 10"
        >
          <path d="M1 3 L5 7 L9 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && <div className="wtg-dropdown-panel">{children}</div>}
    </li>
  );
}

/**
 * A single link row inside a NavDropdown panel.
 */
function DropdownLink({ to, icon, children, active, onClick }) {
  return (
    <Link to={to} onClick={onClick} className={`wtg-dropdown-link ${active ? "active" : ""}`}>
      <span>{icon}</span> {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const role = user?.role;

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function closeAll() {
    setIsNavOpen(false);
    setOpenDropdown(null);
  }

  // Close any open dropdown when clicking outside the nav
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="wtg-header">
      <div className="wtg-navbar-inner" ref={navRef}>
        {/* ── Brand ── */}
        <Link className="wtg-brand" to="/" onClick={closeAll}>
          <img src="/images/earth.png" alt="Logo" className="wtg-brand-logo" />
          <span className="wtg-brand-text">
            Web<span className="wtg-brand-accent">Tour</span>Guide
          </span>
        </Link>

        {/* ── Mobile toggle ── */}
        <button
          className="wtg-toggler"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        {/* ── Nav links ── */}
        <div className={`wtg-nav-collapse ${isNavOpen ? "open" : ""}`}>
          <ul className="wtg-nav-list">
            {(() => {
              // Build the full list of visible top-level entries for this role
              const visibleEntries = NAV_CONFIG.filter((entry) => {
                if (!isVisible(entry, role)) return false;
                if (entry.type === "dropdown") {
                  // Only include dropdown if at least one sub-item is visible
                  return entry.items.filter((item) => isVisible(item, role)).length > 0;
                }
                return true;
              });

              const PRIMARY_COUNT = 6; // first 6 shown directly
              const primary = visibleEntries.slice(0, PRIMARY_COUNT);
              const overflow = visibleEntries.slice(PRIMARY_COUNT);

              /** Renders a single nav entry (link or dropdown) */
              function renderEntry(entry) {
                if (entry.type === "link") {
                  const active = entry.match ? entry.match(pathname) : pathname === entry.to;
                  return (
                    <li key={entry.to} className={`wtg-nav-item ${active ? "active" : ""}`}>
                      <Link className={`wtg-nav-link ${active ? "active" : ""}`} to={entry.to} onClick={closeAll}>
                        <span className="wtg-nav-icon">{NAV_ICONS[entry.label]}</span>
                        {entry.label}
                      </Link>
                    </li>
                  );
                }
                // Dropdown entry
                const visibleItems = entry.items.filter((item) => isVisible(item, role));
                return (
                  <NavDropdown
                    key={entry.id}
                    id={entry.id}
                    label={entry.label}
                    active={entry.match(pathname)}
                    openId={openDropdown}
                    setOpenId={setOpenDropdown}
                  >
                    {visibleItems.map((item) => (
                      <DropdownLink
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        active={pathname === item.to}
                        onClick={closeAll}
                      >
                        {item.label}
                      </DropdownLink>
                    ))}
                  </NavDropdown>
                );
              }

              return (
                <>
                  {primary.map(renderEntry)}

                  {/* "More" overflow dropdown — only shown when there are extra items */}
                  {overflow.length > 0 && (
                    <NavDropdown
                      id="__overflow__"
                      label="More"
                      active={overflow.some((e) =>
                        e.type === "link"
                          ? (e.match ? e.match(pathname) : pathname === e.to)
                          : e.match(pathname)
                      )}
                      openId={openDropdown}
                      setOpenId={setOpenDropdown}
                    >
                      {overflow.map((entry) => {
                        if (entry.type === "link") {
                          const active = entry.match ? entry.match(pathname) : pathname === entry.to;
                          return (
                            <DropdownLink
                              key={entry.to}
                              to={entry.to}
                              icon={NAV_ICONS[entry.label]}
                              active={active}
                              onClick={closeAll}
                            >
                              {entry.label}
                            </DropdownLink>
                          );
                        }
                        // Nested dropdown items rendered flat inside "More"
                        return entry.items
                          .filter((item) => isVisible(item, role))
                          .map((item) => (
                            <DropdownLink
                              key={item.to}
                              to={item.to}
                              icon={item.icon}
                              active={pathname === item.to}
                              onClick={closeAll}
                            >
                              {item.label}
                            </DropdownLink>
                          ));
                      })}
                    </NavDropdown>
                  )}
                </>
              );
            })()}
          </ul>

          {/* ── Right side actions ── */}
          <div className="wtg-nav-actions">
            {/* Search icon */}
            <button className="wtg-search-btn" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Separator */}
            <span className="wtg-nav-separator" />

            {user ? (
              <>
                <span className="wtg-user-info">
                  <span className="wtg-user-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <span className="wtg-user-name">{user.fullName || "User"}</span>
                  <span className="wtg-role-badge">{user.role}</span>
                </span>
                <button onClick={() => { closeAll(); handleLogout(); }} className="wtg-btn-login">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="wtg-btn-login" onClick={closeAll}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Login
                </Link>
                <Link to="/register" className="wtg-btn-register" onClick={closeAll}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
