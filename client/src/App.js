import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Government from "./pages/Government";
import Shop from "./pages/Shop";
import SecondHand from "./pages/SecondHand";
import Documents from "./pages/Documents";
import ServiceBooking from "./pages/ServiceBooking";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Admin from "./pages/Admin";
import AdminGovernment from "./pages/AdminGovernment";
import AdminShop from "./pages/AdminShop";
import AdminBookings from "./pages/AdminBookings";
import AdminServiceCategories from "./pages/AdminServiceCategories";
import AdminProductCategories from "./pages/AdminProductCategories";
import AdminBrands from "./pages/AdminBrands";
import AdminOffers from "./pages/AdminOffers";
import AdminUsers from "./pages/AdminUsers";
import AdminPermissions from "./pages/AdminPermissions";
import AdminGallery from "./pages/AdminGallery";
import AdminSecondHand from "./pages/AdminSecondHand";
import AdminDocuments from "./pages/AdminDocuments";
import AdminUploads from "./pages/AdminUploads";
import AdminSettings from "./pages/AdminSettings";
import AdminStatistics from "./pages/AdminStatistics";
import AdminBackup from "./pages/AdminBackup";

import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <HashRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
<Route
  path="/admin/government"
  element={<AdminGovernment />}
/>

          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetails />} />

          <Route path="/government" element={<Government />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/second-hand" element={<SecondHand />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/booking" element={<ServiceBooking />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/admin" element={<Admin />} />

          <Route
            path="/admin/service-categories"
            element={<AdminServiceCategories />}
          />

          <Route path="/admin/shop" element={<AdminShop />} />

          <Route
            path="/admin/product-categories"
            element={<AdminProductCategories />}
          />

          <Route path="/admin/brands" element={<AdminBrands />} />
          <Route path="/admin/offers" element={<AdminOffers />} />

          <Route
            path="/admin/second-hand"
            element={<AdminSecondHand />}
          />

          <Route path="/admin/users" element={<AdminUsers />} />

          <Route
            path="/admin/permissions"
            element={<AdminPermissions />}
          />

          <Route path="/admin/gallery" element={<AdminGallery />} />

          <Route
            path="/admin/documents"
            element={<AdminDocuments />}
          />

          <Route path="/admin/uploads" element={<AdminUploads />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route
            path="/admin/statistics"
            element={<AdminStatistics />}
          />

          <Route path="/admin/backup" element={<AdminBackup />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;