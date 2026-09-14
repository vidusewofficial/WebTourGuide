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
import PackageList from "./pages/packages/List";
import PackageDetail from "./pages/packages/Detail";
import PackageCompare from "./pages/packages/Compare";
import PackageAdminForm from "./pages/packages/AdminForm";
import NewBooking from "./pages/bookings/NewBooking";
import MyBookings from "./pages/bookings/MyBookings";
import AdminAllBookings from "./pages/bookings/AdminAllBookings";

// Trip Planning Management routes — Group Y2-S1-MLB-B2G2-03
import MyTrips from "./pages/tripplanner/MyTrips";
import TripEditor from "./pages/tripplanner/TripEditor";

import GuideList from "./pages/guides/List";
import GuideProfile from "./pages/guides/Profile";
import GuideEditForm from "./pages/guides/EditForm";

// Customer Support Management routes — Group Y2-S1-MLB-B2G2-03
import NewTicket from "./pages/support/NewTicket";
import MyTickets from "./pages/support/MyTickets";
import StaffQueue from "./pages/support/StaffQueue";

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
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/packages" element={<PackageList />} />
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/packages/compare" element={<PackageCompare />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />

            <Route element={<ProtectedRoute allow={["TOURIST", "ADMIN", "STAFF"]} />}>
              <Route path="/bookings/new" element={<NewBooking />} />
              <Route path="/bookings/my" element={<MyBookings />} />
            </Route>

            <Route element={<ProtectedRoute allow={["ADMIN", "STAFF"]} />}>
              <Route path="/admin/bookings" element={<AdminAllBookings />} />
              <Route path="/admin/destinations/new" element={<DestinationAdminForm />} />
              <Route path="/admin/packages/new" element={<PackageAdminForm />} />
            </Route>

            {/* Tour Guide Management routes */}
            <Route path="/guides" element={<GuideList />} />
            <Route path="/guides/:id" element={<GuideProfile />} />
            <Route element={<ProtectedRoute allow={["TOUR_GUIDE", "ADMIN"]} />}>
              <Route path="/guides/:id/edit" element={<GuideEditForm />} />
            </Route>

            {/* Trip Planning Management routes — only TOURIST role can access */}
            <Route element={<ProtectedRoute allow={["TOURIST"]} />}>
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/trips/:id" element={<TripEditor />} />
            </Route>

            {/* Customer Support Management routes */}
            <Route element={<ProtectedRoute allow={["TOURIST"]} />}>
              <Route path="/support/new" element={<NewTicket />} />
              <Route path="/support/my" element={<MyTickets />} />
            </Route>
            <Route element={<ProtectedRoute allow={["STAFF", "ADMIN"]} />}>
              <Route path="/staff/support" element={<StaffQueue />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
