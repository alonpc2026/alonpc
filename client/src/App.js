import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminShop from "./pages/AdminShop";
import AdminBookings from "./pages/AdminBookings";
import Shop from "./pages/Shop";
import ServiceBooking from "./pages/ServiceBooking";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetails />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/shop" element={<AdminShop />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/booking" element={<ServiceBooking />} />

          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;