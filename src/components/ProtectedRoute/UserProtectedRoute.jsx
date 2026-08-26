
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const UserProtectedRoute = ({ children, requiredPermission }) => {

  const token = localStorage.getItem("token");
  const location = useLocation();

  const [permissions, setPermissions] = useState(localStorage.getItem("permission"));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 

 
  // 🔄 Show loader while fetching
  if (loading) {
    return <div>Loading...</div>; // or <Loader />
  }

  // ❌ No token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const hasAccess = [...requiredPermission].some(role =>
    permissions?.includes(role)
  );


  // ❌ No permission → unauthorized
  if (!hasAccess) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location }}
        replace
      />
    );
  }

  // ✅ Allowed
  return children;
};

export default UserProtectedRoute;