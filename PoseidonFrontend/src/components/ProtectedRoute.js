import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useUserAuth();

  console.log("Check user in ProtectedRoute: ", user);

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If `allowedRoles` are provided, ensure the user's role matches
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn("Access denied: user role not authorized");
    return <Navigate to="/" replace />;
  }

  // Render the protected component if user is authorized
  return children;
};

export default ProtectedRoute;
