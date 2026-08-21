import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DestinationList from "./pages/destinations/List";
import DestinationDetail from "./pages/destinations/Detail";
import DestinationAdminForm from "./pages/destinations/AdminForm";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<DestinationList />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/destinations"
            element={<DestinationList />}
          />

          <Route
            path="/destinations/:id"
            element={<DestinationDetail />}
          />

          <Route
            element={
              <ProtectedRoute allow={["ADMIN", "STAFF"]} />
            }
          >
            <Route
              path="/admin/destinations/new"
              element={<DestinationAdminForm />}
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}