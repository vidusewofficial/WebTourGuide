import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { register as registerApi } from "../api/authApi";

export default function Auth() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we should show login or register based on URL
  const [activeTab, setActiveTab] = useState("login");
  
  useEffect(() => {
    if (location.pathname === "/register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [location.pathname]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerApi({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || null,
      });
      // Auto login or switch to login tab
      setActiveTab("login");
      setError(""); // Clear error
      alert("Registration successful! Please login.");
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please check the entered information."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div 
      className="auth-page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="auth-container">
        {/* Left Side - Image & Copy */}
        <div className="auth-left">
          <div className="auth-left-content">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Explore.<br />
              Discover.<br />
              <span className="text-highlight">Experience.</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Discover breathtaking destinations and personalized tours made just for you.
            </motion.p>
            
            <motion.div 
              className="auth-stats"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="stat-item">
                <div className="stat-icon">📍</div>
                <h4>500+</h4>
                <span>Destinations</span>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <h4>1200+</h4>
                <span>Happy Travelers</span>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎧</div>
                <h4>24/7</h4>
                <span>Support</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-right">
          <div className="auth-form-card">
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("login");
                  navigate("/login");
                  setError("");
                }}
              >
                Login
              </button>
              <button 
                className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("register");
                  navigate("/register");
                  setError("");
                }}
              >
                Register
              </button>
            </div>

            <div className="auth-form-header">
              <h2>{activeTab === "login" ? "Welcome Back!" : "Create Account"}</h2>
              <p>
                {activeTab === "login" 
                  ? "Login to continue your adventure and explore amazing destinations."
                  : "Join us to discover top travel spots and book certified guides."
                }
              </p>
            </div>

            {error && <div className="alert alert-danger" style={{ fontSize: "14px", padding: "10px" }}>{error}</div>}

            {activeTab === "login" ? (
              <motion.form 
                onSubmit={handleLogin}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="auth-input-group">
                  <label>Email Address</label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon">✉️</span>
                    <input 
                      type="email" 
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Password</label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input 
                      type="password" 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-forgot-password">
                  <a href="#">Forgot Password?</a>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div className="auth-divider">
                  <span>or</span>
                </div>

                <button type="button" className="auth-google-btn">
                  <img src="/images/google-icon.png" alt="Google" onError={(e) => e.target.style.display='none'} />
                  Login with Google
                </button>

                <p className="auth-switch-text">
                  Don't have an account? <span onClick={() => { setActiveTab("register"); navigate("/register"); }}>Register</span>
                </p>
              </motion.form>
            ) : (
              <motion.form 
                onSubmit={handleRegister}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="auth-input-group">
                  <label>Full Name</label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon">👤</span>
                    <input 
                      type="text" 
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Email Address</label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon">✉️</span>
                    <input 
                      type="email" 
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Password</label>
                  <div className="auth-input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input 
                      type="password" 
                      placeholder="Create a password (min 6 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn mt-4" disabled={loading}>
                  {loading ? "Creating Account..." : "Register"}
                </button>

                <p className="auth-switch-text mt-4">
                  Already have an account? <span onClick={() => { setActiveTab("login"); navigate("/login"); }}>Login</span>
                </p>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
