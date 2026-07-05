import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Shop from "./pages/Shop";
import SecondHand from "./pages/SecondHand";
import ServiceBooking from "./pages/ServiceBooking";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Admin from "./pages/Admin";
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

import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>

          {/* אתר */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/second-hand" element={<SecondHand />} />
          <Route path="/booking" element={<ServiceBooking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* פורטל ניהול */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* שירותים */}
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/admin/service-categories"
            element={<AdminServiceCategories />}
          />

          {/* חנות */}
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

          {/* משתמשים */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route
            path="/admin/permissions"
            element={<AdminPermissions />}
          />

          {/* מדיה */}
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route
            path="/admin/documents"
            element={<AdminDocuments />}
          />
          <Route
            path="/admin/uploads"
            element={<AdminUploads />}
          />

          {/* מערכת */}
          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />

          <Route
            path="/admin/statistics"
            element={<AdminStatistics />}
          />

          {/* הזמנות */}
          <Route
            path="/admin/bookings"
            element={<AdminBookings />}
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;