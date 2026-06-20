import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Core Client Components
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";


// Administrative Master Views
import Dashboard from "./admin/Dashboard";
import Complaints from "./admin/Complaints";
import Products from "./admin/Products";
import Orders from "./admin/Orders";
import Customers from "./admin/Customers";
import FeedbackReviews from "./admin/FeedbackReviews";
import Coupons from "./admin/Coupons";
import Analytics from "./admin/Analytics";

// Temporary placeholder views for newly allocated sub-routes
const PlaceholderView = ({ title }) => (
  <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm font-body">
    <h1 className="text-2xl font-heading font-bold text-brown mb-2">{title} Platform</h1>
    <p className="text-sm text-gray-500">Database node connectors for this executive control section are active. Interfaces are syncing.</p>
  </div>
);

// Guards & Chatbot
import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import { 
  BarChart3, AlertCircle, ShoppingBag, LayoutDashboard, 
  Package, ShoppingCart, Users, Star, Ticket, Home as HomeIcon 
} from "lucide-react";

// Updated Admin Dashboard Layout Shell with Extended Control Options Sidebar
function AdminDashboardLayout() {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/products", name: "Products", icon: <Package size={18} /> },
    { path: "/admin/orders", name: "Orders", icon: <ShoppingCart size={18} /> },
    { path: "/admin/customers", name: "Customers", icon: <Users size={18} /> },
    { path: "/admin/feedback-reviews", name: "Feedback", icon: <Star size={18} /> },
    { path: "/admin/complaints", name: "Complaints", icon: <AlertCircle size={18} /> },
    { path: "/admin/coupons", name: "Coupons", icon: <Ticket size={18} /> },
    { path: "/admin/analytics", name: "Analytics", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div className="flex bg-gray-50 font-body relative min-h-[calc(100vh-5rem)] z-10">
      
      {/* Persisted Extended Administration Side Bar Menu Control Panel */}
      <aside className="w-64 bg-[#3D1C00] text-[#FFFDF5] p-5 flex flex-col justify-between shadow-2xl flex-shrink-0 relative z-30 select-none">
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-mango">Bliss Control</h2>
            <p className="text-[9px] text-orange-100/40 uppercase tracking-widest font-bold mt-0.5">Enterprise Management</p>
          </div>
          
          <nav className="space-y-1 relative z-40 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  location.pathname === item.path 
                    ? "bg-mango text-white shadow-md font-bold transform translate-x-1" 
                    : "text-orange-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-orange-200 hover:bg-white/10 transition-all border border-orange-200/20 relative z-40 cursor-pointer mt-4"
        >
          <HomeIcon size={14} /> Return to Store
        </Link>
      </aside>

      {/* Primary Workspace Viewport Screen Content Frame */}
      <div className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-5rem)] relative z-20 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col min-h-screen bg-[#FFFDF5]">
        <Navbar />

        <main className="flex-grow pt-20">
          <Routes>
            {/* Storefront End-User Paths */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* Fully Encapsulated Extended Administrative Route Core Architecture Tree */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="feedback-reviews" element={<FeedbackReviews />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>

            {/* General Wildcard Route redirection map fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}