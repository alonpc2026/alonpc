import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getSavedUser() {
  try {
    const value = localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = getSavedUser();

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
          message: "יש להתחבר כדי להיכנס לעמוד זה.",
        }}
      />
    );
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
