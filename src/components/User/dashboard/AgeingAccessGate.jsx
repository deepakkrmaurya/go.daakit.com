
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AxiosInstance from "@/Helper/axiosInstance";

const AgeingAccessGate = ({ children }) => {
  const [access, setAccess] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    const checkAccess = async () => {
      try {
        const response = await AxiosInstance.get(
          "/api/analytics/ageing/user",
          {
            params: {
              cluster: "all",
              show_vendor: true,
            },
          }
        );

        if (!cancelled) {
          setAccess(
            response.status === 200 &&
            response.data?.success
              ? "allowed"
              : "denied"
          );
        }
      } catch (error) {
        if (!cancelled) {
          setAccess("denied");
        }
      }
    };

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  if (access === "checking") {
    return (
      <div className="p-6 text-gray-500">
        Checking access...
      </div>
    );
  }

  if (access === "denied") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AgeingAccessGate;
