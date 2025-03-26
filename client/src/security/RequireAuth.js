// this is RequireAuth.js

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "./AuthContext";

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuthUser();

  if (loading) {
    return <p>Loading...</p>; // Show a loading state while authentication is verified
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return children; // Render the protected component if authenticated
}

export default RequireAuth;
