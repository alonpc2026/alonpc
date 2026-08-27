import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";

import Home from "./pages/Home";
import Emergency from "./pages/Emergency";
import InterestingSites from "./pages/InterestingSites";
import FacebookGroupLinks from "./pages/FacebookGroupLinks";
import Judaism from "./pages/Judaism";
import JudaismTorahLessons from "./pages/JudaismTorahLessons";
import JudaismHelp from "./pages/JudaismHelp";
import JudaismStudyMaterial from "./pages/JudaismStudyMaterial";
import JudaismEvents from "./pages/JudaismEvents";
import WhatsAppStickers from "./pages/WhatsAppStickers";
import IsraelEvents from "./pages/IsraelEvents";
import PermanentEvents from "./pages/PermanentEvents";
import SignLanguageCourses from "./pages/SignLanguageCourses";
import Services from "./pages/Services";
import Employment from "./pages/Employment";
import ServiceDetails from "./pages/ServiceDetails";
import Government from "./pages/Government";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import SecondHand from "./pages/SecondHand";
import Documents from "./pages/Documents";
import ServiceBooking from "./pages/ServiceBooking";
import AppsHub from "./pages/AppsHub";
import GamesHub from "./pages/GamesHub";
import GamesList from "./pages/GamesList";
import AppsCategory from "./pages/AppsCategory";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Admin from "./pages/Admin";
import AdminGovernment from "./pages/AdminGovernment";
import AdminEmployment from "./pages/AdminEmployment";
import AdminShop from "./pages/AdminShop";
import ProductDetails from "./pages/ProductDetails";
import AdminBookings from "./pages/AdminBookings";
import AdminEvents from "./pages/AdminEvents";
import AdminPermanentEvents from "./pages/AdminPermanentEvents";
import AdminSignLanguageCourses from "./pages/AdminSignLanguageCourses";
import AdminInterestingSites from "./pages/AdminInterestingSites";
import AdminFacebookGroupLinks from "./pages/AdminFacebookGroupLinks";
import AdminJudaism from "./pages/AdminJudaism";
import AdminWhatsAppStickers from "./pages/AdminWhatsAppStickers";
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
import AdminApps from "./pages/AdminApps";
import AdminGames from "./pages/AdminGames";
import AdminEmergency from "./pages/AdminEmergency";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Transport from "./pages/Transport";
import Health from "./pages/Health";
import NationalInsurance from "./pages/NationalInsurance";
import AdminTransport from "./pages/AdminTransport";
import AdminHealth from "./pages/AdminHealth";
import AdminNationalInsurance from "./pages/AdminNationalInsurance";

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
              <Route path="/emergency" element={<Emergency />} />

              {/* אתרים מעניינים של אלון */}
              <Route path="/interesting-sites" element={<InterestingSites />} />
              <Route path="/facebook-group-links" element={<FacebookGroupLinks />} />
              <Route path="/judaism" element={<Judaism />} />
              <Route path="/judaism/torah-lessons" element={<JudaismTorahLessons />} />
              <Route path="/judaism/help" element={<JudaismHelp />} />
              <Route path="/judaism/study-material" element={<JudaismStudyMaterial />} />
              <Route path="/judaism/events" element={<JudaismEvents />} />
              <Route path="/whatsapp-stickers" element={<WhatsAppStickers />} />

              <Route path="/israel-events" element={<IsraelEvents />} />
              <Route path="/events" element={<IsraelEvents />} />
              <Route path="/permanent-events" element={<PermanentEvents />} />
              <Route path="/sign-language-courses" element={<SignLanguageCourses />} />

              <Route
                path="/admin/employment"
                element={
                  <AdminRoute>
                    <AdminEmployment />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/government"
                element={
                  <AdminRoute>
                    <AdminGovernment />
                  </AdminRoute>
                }
              />

              <Route path="/services" element={<Services />} />
              <Route path="/transport" element={<Transport />} />
              <Route path="/health" element={<Health />} />
              <Route path="/national-insurance" element={<NationalInsurance />} />
              <Route path="/employment" element={<Employment />} />
              <Route path="/service/:id" element={<ServiceDetails />} />

              <Route path="/government" element={<Government />} />

              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/second-hand" element={<SecondHand />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/booking" element={<ServiceBooking />} />
              <Route path="/apps" element={<AppsHub />} />
              <Route path="/apps/mobile" element={<AppsCategory />} />
              <Route path="/apps/:type" element={<AppsCategory />} />
              <Route path="/games" element={<GamesHub />} />
              <Route path="/games/:type" element={<GamesList />} />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/service-categories"
                element={
                  <AdminRoute>
                    <AdminServiceCategories />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/shop"
                element={
                  <AdminRoute>
                    <AdminShop />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/product-categories"
                element={
                  <AdminRoute>
                    <AdminProductCategories />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/brands"
                element={
                  <AdminRoute>
                    <AdminBrands />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/offers"
                element={
                  <AdminRoute>
                    <AdminOffers />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/second-hand"
                element={
                  <AdminRoute>
                    <AdminSecondHand />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/permissions"
                element={
                  <AdminRoute>
                    <AdminPermissions />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/gallery"
                element={
                  <AdminRoute>
                    <AdminGallery />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/documents"
                element={
                  <AdminRoute>
                    <AdminDocuments />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/uploads"
                element={
                  <AdminRoute>
                    <AdminUploads />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/statistics"
                element={
                  <AdminRoute>
                    <AdminStatistics />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/backup"
                element={
                  <AdminRoute>
                    <AdminBackup />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/events"
                element={
                  <AdminRoute>
                    <AdminEvents />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/permanent-events"
                element={
                  <AdminRoute>
                    <AdminPermanentEvents />
                  </AdminRoute>
                }
              />


              <Route
                path="/admin/sign-language-courses"
                element={
                  <AdminRoute>
                    <AdminSignLanguageCourses />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/interesting-sites"
                element={
                  <AdminRoute>
                    <AdminInterestingSites />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/facebook-group-links"
                element={
                  <AdminRoute>
                    <AdminFacebookGroupLinks />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/judaism"
                element={
                  <AdminRoute>
                    <AdminJudaism />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/whatsapp-stickers"
                element={
                  <AdminRoute>
                    <AdminWhatsAppStickers />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <AdminBookings />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/apps"
                element={
                  <AdminRoute>
                    <AdminApps />
                  </AdminRoute>
                }
              />


              <Route
                path="/admin/games"
                element={
                  <AdminRoute>
                    <AdminGames />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/emergency"
                element={
                  <AdminRoute>
                    <AdminEmergency />
                  </AdminRoute>
                }
              />
                          <Route path="/admin/transport" element={<AdminRoute><AdminTransport /></AdminRoute>} />
              <Route path="/admin/health" element={<AdminRoute><AdminHealth /></AdminRoute>} />
              <Route path="/admin/national-insurance" element={<AdminRoute><AdminNationalInsurance /></AdminRoute>} />
</Routes>
          </div>
        </HashRouter>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
