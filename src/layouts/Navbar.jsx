import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { logoutUser } from "../firebase/auth";
import { toast } from "react-hot-toast";
import {
  ShoppingBasket,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

export default function Navbar() {
  const user = useAppStore((state) => state.user);
  const cartCount = useAppStore((state) => state.cartCount());
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isAdminUser = user && (user.isAdmin || user.email === "w@gmail.com");

  const handleSignOut = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully.");
      navigate("/");
      setIsOpen(false);
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100">
      <div className="h-20 px-4 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold font-heading text-brown flex items-center gap-2"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <span>🥭</span>
          <span>Mango Bliss</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/shop" className="hover:text-mango transition">
            Shop Harvest
          </Link>

          <Link to="/about" className="hover:text-mango transition">
            Our Story
          </Link>

          <Link to="/contact" className="hover:text-mango transition">
            Contact Hub
          </Link>

          <Link to="/feedback" className="hover:text-mango transition">
            Feedback
          </Link>
        </div>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Admin */}
          {isAdminUser && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 bg-mango text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-mango-dark transition"
            >
              <ShieldCheck size={14} />
              Admin Panel
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 text-brown hover:text-mango transition"
          >
            <ShoppingBasket size={22} />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <Link
                to="/profile"
                className="text-xs font-semibold text-gray-600 hover:text-mango transition flex items-center gap-1 max-w-[140px] group"
                title="View your account & purchase history"
              >
                <span className="truncate group-hover:underline">
                  Hi, {user.displayName || user.email.split("@")[0]}
                </span>
              </Link>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gray-50 border px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-50 transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4 animate-fade-in">
          <Link to="/shop" onClick={() => setIsOpen(false)}>
            Shop Harvest
          </Link>

          <Link to="/about" onClick={() => setIsOpen(false)}>
            Our Story
          </Link>

          <Link to="/contact" onClick={() => setIsOpen(false)}>
            Contact Hub
          </Link>

          <Link to="/feedback" onClick={() => setIsOpen(false)}>
            Feedback
          </Link>

          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2"
          >
            <ShoppingBasket size={18} />
            Cart ({cartCount})
          </Link>

          {isAdminUser && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-mango font-bold"
            >
              <ShieldCheck size={16} />
              Admin Panel
            </Link>
          )}

          {user ? (
            <div className="border-t pt-4 space-y-3">
              {/* FIXED: Interactive routing hook inside mobile collapse drawer container */}
              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-brown hover:text-mango font-bold text-sm"
              >
                <User size={16} className="text-mango" />
                <span>My Account Profile</span>
              </Link>
              <p className="text-xs text-gray-400 px-6 truncate">{user.email}</p>

              <button
                onClick={handleSignOut}
                className="w-full text-left text-red-500 font-bold text-sm pt-2 cursor-pointer"
              >
                Logout Account
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="font-semibold text-brown hover:text-mango"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}