import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Auth from "./pages/Auth";
import DestinationList from "./pages/destinations/List";
import DestinationDetail from "./pages/destinations/Detail";
import DestinationAdminForm from "./pages/destinations/AdminForm";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<DestinationList />} />
            <Route path="/services" element={<Services />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />

            <Route element={<ProtectedRoute allow={["ADMIN", "STAFF"]} />}>
              <Route path="/admin/destinations/new" element={<DestinationAdminForm />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}