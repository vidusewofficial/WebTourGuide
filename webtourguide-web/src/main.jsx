import { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/bootstrap.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./index.css";
import App from "./App.jsx";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#01122a",
            color: "#ffffff",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "15px", color: "#f07b26" }}>Something went wrong</h2>
          <p style={{ maxWidth: "500px", color: "#ccc", marginBottom: "20px" }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            style={{
              backgroundColor: "#f07b26",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: "25px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Clear Cache &amp; Reload Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
