
// import { useEffect, useState } from "react";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import AxiosInstance from "@/Helper/axiosInstance";

// const baseURL = import.meta.env.VITE_BASE_URL;

// const UserProtectedRoute = ({ children, requiredPermission }) => {

//   const token = localStorage.getItem("token");
//   const location = useLocation();

//   const [permissions, setPermissions] = useState(localStorage.getItem("permission"));
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
   
//   useEffect(async()=>{
//     try {
//         const res = await AxiosInstance.get(`/api/user/getUserPermissions`, {
         
//         });
  
//         const permission = res?.data?.data?.data || [];
//          localStorage.setItem('permission',JSON.stringify(permission))
//          console.log(permission)
//         setPermissions(permission)
//         if (
//           !permission.includes("ODR_VIEW") &&
//           !permission.includes("ADMIN_FULL_ACCESS")
//         ) {
//           navigate("/unauthorized");
//           return;
//         }
//         setPermissions(res?.data?.data?.data)
  
  
//       } catch (error) {
//         toast.error('')
//       }
//   },[])

 
//   // 🔄 Show loader while fetching
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // ❌ No token → login
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//   const hasAccess = [...requiredPermission].some(role =>
//     permissions?.includes(role)
//   );


//   // ❌ No permission → unauthorized
//   if (!hasAccess) {
//     return (
//       <Navigate
//         to="/unauthorized"
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   // ✅ Allowed
//   return children;
// };

// export default UserProtectedRoute;




import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AxiosInstance from "@/Helper/axiosInstance";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import LazyLoading from "../../components/layout/LazyLoding";
const UserProtectedRoute = ({
  children,
  requiredPermission = [],
}) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPermissions = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(false);
        }

        const res = await AxiosInstance.get(
          "/api/user/getUserPermissions"
        );

        const permissionData = res?.data?.data?.data;

        if (!Array.isArray(permissionData)) {
          throw new Error("Invalid permissions response");
        }

        if (!isMounted) return;

        localStorage.setItem(
          "permission",
          JSON.stringify(permissionData)
        );

        setPermissions(permissionData);

      } catch (error) {
        console.error("Failed to fetch permissions:", error);

        if (isMounted) {
          setError(true);
          toast.error("Unable to verify user permissions");
        }

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPermissions();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // No authentication token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Loading permissions
  if (loading) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LazyLoading />
        </div>
      </div>
    );
  }

  // Permission API error
  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-600">
          Unable to verify your permissions.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-[#0446DB] px-5 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  // Normalize required permissions
  const required = Array.isArray(requiredPermission)
    ? requiredPermission
    : requiredPermission
      ? [requiredPermission]
      : [];

  // Admin full access
  const isAdmin = permissions.includes("ADMIN_FULL_ACCESS");

  // Check required permissions
  const hasRequiredPermission =
    required.length === 0 ||
    required.some((permission) =>
      permissions.includes(permission)
    );

  const hasAccess = isAdmin || hasRequiredPermission;

  // Unauthorized
  if (!hasAccess) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default UserProtectedRoute;