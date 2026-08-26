

import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
const ProtectedRoute = ({ children, allowedRoles = [], requiredPermission,permissions }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.usertype || decoded.type || decoded.userType;

   
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    // ❌ Permission check
    // if (requiredPermission && !permissions.includes(requiredPermission)) {
    //   return <Navigate to="/unauthorized" replace />;
    // }

    return children;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;