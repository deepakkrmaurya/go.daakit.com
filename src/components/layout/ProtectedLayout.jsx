import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./Navbar";
const LazyLoading = lazy(() => import("./LazyLoding"));
const getLocalPermissions = () => {
  const stored = localStorage.getItem("permission");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    return stored;
  }
};

const ProtectedLayout = ({ allowedRoles, loading }) => {
    const LoadingFallback = () => (
      <LazyLoading />
    );
  const currentPermissions = getLocalPermissions();

  if (loading || currentPermissions === null) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProtectedRoute allowedRoles={allowedRoles} permissions={currentPermissions}>
        <Navbar allowedRoles={allowedRoles} permissions={currentPermissions} />
      </ProtectedRoute>
    </Suspense>
  );
};



export {
    ProtectedLayout
}