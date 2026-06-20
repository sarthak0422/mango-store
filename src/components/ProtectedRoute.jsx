import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = useAppStore((state) => state.user);
  const loading = useAppStore((state) => state.loading);
  const location = useLocation();

  // 1. Explicitly wait if the store's connection stream layer is active
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#FFFDF5]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-mango border-t-transparent" />
      </div>
    );
  }

  // 2. Clear out unauthenticated actions immediately
  if (!user) {
    // Save the current location context so the admin lands back here automatically after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Confirm clear administrative clearance criteria matches
  const isUserAdmin = user.isAdmin || user.email === "w@gmail.com";
  
  if (adminOnly && !isUserAdmin) {
    console.warn("Access Denied: Account email lacks administrative clearance tokens.");
    return <Navigate to="/" replace />;
  }

  return children;
}