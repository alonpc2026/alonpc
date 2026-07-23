import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";

import Home from "./pages/Home";
import AlonLinks from "./pages/AlonLinks";
import IsraelEvents from "./pages/IsraelEvents";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Government from "./pages/Government";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import SecondHand from "./pages/SecondHand";
import Documents from "./pages/Documents";
import ServiceBooking from "./pages/ServiceBooking";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Admin from "./pages/Admin";
import AdminGovernment from "./pages/AdminGovernment";
import AdminShop from "./pages/AdminShop";
import ProductDetails from "./pages/ProductDetails";
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


function readStoredUser() {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = readStoredUser();
  const isAdmin = Boolean(token) && user?.role === "admin";

  return isAdmin ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <HashRouter>
          <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/interesting-sites" element={<AlonLinks />} />
          <Route path="/israel-events" element={<IsraelEvents />} />
          <Route
            path="/admin/government"
            element={<AdminRoute><AdminGovernment /></AdminRoute>}
          />

          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetails />} />

          <Route path="/government" element={<Government />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/second-hand" element={<SecondHand />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/booking" element={<ServiceBooking />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />

          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

          <Route
            path="/admin/service-categories"
            element={<AdminRoute><AdminServiceCategories /></AdminRoute>}
          />

          <Route path="/admin/shop" element={<AdminRoute><AdminShop /></AdminRoute>} />

          <Route
            path="/admin/product-categories"
            element={<AdminRoute><AdminProductCategories /></AdminRoute>}
          />

          <Route path="/admin/brands" element={<AdminRoute><AdminBrands /></AdminRoute>} />
          <Route path="/admin/offers" element={<AdminRoute><AdminOffers /></AdminRoute>} />

          <Route
            path="/admin/second-hand"
            element={<AdminRoute><AdminSecondHand /></AdminRoute>}
          />

          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

          <Route
            path="/admin/permissions"
            element={<AdminRoute><AdminPermissions /></AdminRoute>}
          />

          <Route path="/admin/gallery" element={<AdminRoute><AdminGallery /></AdminRoute>} />

          <Route
            path="/admin/documents"
            element={<AdminRoute><AdminDocuments /></AdminRoute>}
          />

          <Route path="/admin/uploads" element={<AdminRoute><AdminUploads /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

          <Route
            path="/admin/statistics"
            element={<AdminRoute><AdminStatistics /></AdminRoute>}
          />

          <Route path="/admin/backup" element={<AdminRoute><AdminBackup /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
        </Routes>
          </div>
        </HashRouter>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;