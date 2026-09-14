import { createContext, useContext, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved || saved === "undefined" || saved === "null") {
        return null;
      }
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not parse user from localStorage:", e);
      try {
        localStorage.removeItem("user");
      } catch (_) {}
      return null;
    }
  });

  async function login(email, password) {
    const res = await authApi.login({ email, password });

    if (res?.token) {
      localStorage.setItem("token", res.token);
    }

    const userData = {
      fullName: res.fullName || res.name || "User",
      role: res.role || "TOURIST",
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (_) {}
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to safely consume the authentication context. */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, login: async () => {}, logout: () => {} };
  }
  return context;
};