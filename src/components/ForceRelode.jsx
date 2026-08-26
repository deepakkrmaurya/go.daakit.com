import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ForceReload = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/user/analytics") {
      const hasReloaded = sessionStorage.getItem("analyticsReloaded");

      if (!hasReloaded) {
        sessionStorage.setItem("analyticsReloaded", "true");
        window.location.reload();
      }
    }
  }, [location]);

  return null;
};

export default ForceReload;