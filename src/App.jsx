

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load all components
const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const Analytics = lazy(() => import("./components/admin/Analytics"));
const Navbar = lazy(() => import("./components/Navbar"));
const OrderDetails = lazy(() => import("./components/admin/OrderDetails"));
const CODRemittances = lazy(() => import("./components/admin/CODRemittances"));
const RiderOnboarding = lazy(() => import("./components/admin/RiderOnboarding"));
const OrderAssignment = lazy(() => import("./components/admin/OrderAssignment"));
const RoutePlanning = lazy(() => import("./components/admin/RoutePlanning"));
const NDR = lazy(() => import("./components/admin/NDR"));
const VendorStats = lazy(() => import("./components/admin/VendorStats"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const VendorRiders = lazy(() => import("./components/admin/VendorRiders"));
const VendorOnboarding = lazy(() => import("./components/VendorOnboarding"));
const VendorAnalytics = lazy(() => import("./components/vendor_components/VendorAnalytics"));
const VendorAllRiders = lazy(() => import("./components/vendor_components/VendorAllRiders"));
const VendorCodRemittance = lazy(() => import("./components/vendor_components/VendorCodRemittance"));
const VendorOrderDetails = lazy(() => import("./components/vendor_components/VendorOrderDetails"));
const VendorMappedOrder = lazy(() => import("./components/vendor_components/VendorMappedOrder"));
const VendorRiderOnboarding = lazy(() => import("./components/vendor_components/VendorRiderOnboarding"));
const OrderTracking = lazy(() => import("./components/OrderTracking"));
const TrackOrder = lazy(() => import("./components/TrackOrder"));
const MerchantAnalytics = lazy(() => import("./components/merchant_component/MerchantAnalytics"));
const MerchantOrderTracking = lazy(() => import("./components/merchant_component/MerchantOrderTracking"));
const MerchantNDR = lazy(() => import("./components/merchant_component/MerchantNDR"));
const MerchantRemittances = lazy(() => import("./components/admin/MerchantRemittances"));
const MerchantOnboarding = lazy(() => import("./components/MerchantOnboarding"));
const MerchantDetails = lazy(() => import("./components/admin/MerchantDetails"));
const MerchantCOD = lazy(() => import("./components/merchant_component/MerchantCOD"));
const TrackAWBOrder = lazy(() => import("./components/TrackAWBOrder"));
const RemittanceStatusVendor = lazy(() => import("./components/admin/RemittanceStatusVendor"));
const VendorRemittanceRecord = lazy(() => import("./components/vendor_components/VendorRemittanceRecord"));
const RidersMap = lazy(() => import("./components/admin/RidersMap"));
const VendorRidersMap = lazy(() => import("./components/vendor_components/VendorRidersMap"));
const MerchantCX = lazy(() => import("./components/merchant_component/MerchantCX"));
const IncognitoLogin = lazy(() => import("./components/IncognitoLogin"));
const MerchantOrderDetails = lazy(() => import("./components/merchant_component/MerchantOrderDetails"));
const LiveLocation = lazy(() => import("./components/merchant_component/LiveLocation"));
const CodRemittances = lazy(() => import("./components/merchant_component/CodRemittances"));
const Subscription = lazy(() => import("./components/admin/Subscription"));
const TechMerchantOrderDetails = lazy(() => import("./components/merchant_component/techbasedMerchant/TechMerchantOrderDetails"));
const TechMerchantAnalytics = lazy(() => import("./components/merchant_component/techbasedMerchant/TechMerchantAnalytics"));
const TechMerchantOrderTracking = lazy(() => import("./components/merchant_component/techbasedMerchant/TechMerchantOrderTracking"));
const TechMerchantNDR = lazy(() => import("./components/merchant_component/techbasedMerchant/TechMerchantNDR"));
const TechMerchantCX = lazy(() => import("./components/merchant_component/techbasedMerchant/TechMerchantCX"));
const TechBasedOnBoarding = lazy(() => import("./components/merchant_component/techbasedMerchant/TechBasedOnBoarding"));
const TechBasedRiderStats = lazy(() => import("./components/merchant_component/techbasedMerchant/TechBasedRiderStats"));
const TechCreateOrder = lazy(() => import("./components/merchant_component/techbasedMerchant/TechCreateOrder"));
const CreateOrder = lazy(() => import("./components/merchant_component/CreateOrder"));
const BulkUpload = lazy(() => import("./components/merchant_component/BulkUpload"));
const DraftsList = lazy(() => import("./components/merchant_component/DraftsList"));
const Insurance  = lazy(() => import("./components/merchant_component/Insurance"));
const Recharge = lazy(() => import("./components/merchant_component/techbasedMerchant/Recharge"));
const PaymentSuccess = lazy(() => import("./components/merchant_component/techbasedMerchant/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./components/merchant_component/techbasedMerchant/paymentFaild"));
const TechCodRemittances = lazy(() => import("./components/merchant_component/techbasedMerchant/TechCodRemittances"));
const CouponForm = lazy(() => import("./components/admin/CouponForm"));
const Coupon = lazy(() => import("./components/admin/Coupon"));
const Pricing = lazy(() => import("./components/admin/PricingPlans"));
const UpdatePlanDetails = lazy(() => import("./components/UpdatePlanDetails"));
const TechbasedMerchentRemittances = lazy(() => import("./components/merchant_component/techbasedMerchant/TechbasedMerchentRemittances"));
const TechProfile = lazy(() => import("./components/merchant_component/techbasedMerchant/TechProfile"));
const Profile = lazy(() => import("./components/merchant_component/Profile"));
const TechCreateOrderTurant = lazy(() => import("./components/merchant_component/techbasedMerchant/TechCreateOrderTurant"));
const TechbasedTransaction = lazy(() => import("./components/merchant_component/techbasedMerchant/TechbasedTransaction"));
const Transaction = lazy(() => import("./components/merchant_component/Transaction"));
const Support = lazy(() => import("./components/merchant_component/Support"));
const OTPSendComponent = lazy(() => import("./components/handleSendOTP"));
const ForgotPasswordMerchant = lazy(() => import("./components/FotgotPasswordMerchant"));
const VendorForgotPassword = lazy(() => import("./components/vendor_components/VendorForgotPassword"));
const VendorRegistrationPage = lazy(() => import("./components/VendorRegiater"));
const ChangePassword = lazy(() => import("./components/merchant_component/ChangePassword"));
const SecurityKey = lazy(() => import("./components/merchant_component/SecurityKey"));
const Integration = lazy(() => import("./components/merchant_component/Integration"));

const TechChangePassword = lazy(() => import("./components/merchant_component/techbasedMerchant/TechChangePassword"));
const TechSecurityKey = lazy(() => import("./components/merchant_component/techbasedMerchant/TechSecurityKey"));
const TechIntegration = lazy(() => import("./components/merchant_component/techbasedMerchant/Integration"));

const Unauthorized = lazy(() => import("./components/Unauthorized"));
const CreateRiderRate = lazy(() => import("./components/merchant_component/CreateRiderRate"));
const RiderRates = lazy(() => import("./components/merchant_component/techbasedMerchant/RiderRates"));
const VendorProfile = lazy(() => import("./components/vendor_components/VendorProfile"));
const RiderRateList = lazy(() => import("./components/vendor_components/RiderRateList"));
const CreateRider = lazy(() => import("./components/vendor_components/CreateRate"));
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const FestiveWisher = lazy(() => import("./components/ddd/FestiveWisher"));
const Page404 = lazy(() => import("./components/Page404"));
const InspectController = lazy(() => import("./Helper/InspectController"));
const OrderSuccess = lazy(() => import("./components/OrderSuccess"));
const HubList = lazy(() => import("./components/vendor_components/HubList"));
const MerchantPricing = lazy(() => import("./components/merchant_component/Pricing"));
const CreateHub = lazy(() => import("./components/vendor_components/CreateHub"));
const OrderHistory = lazy(() => import("./components/admin/OrderHistory"));
const PriceDetails = lazy(() => import("./components/merchant_component/PriceDetails"));
const MerchantRecharge = lazy(() => import("./components/merchant_component/Recharge"));
const PriceCalculate = lazy(() => import("./components/merchant_component/PriceCalculate"));
const TechMerchantPricingCalculator = lazy(() => import("./components/merchant_component/techbasedMerchant/PricingCalculater"));
const TechPriceDetails = lazy(() => import("./components/merchant_component/techbasedMerchant/PriceDetails"));
const LabelSetting = lazy(() => import("./components/merchant_component/LabelSetting"));
const TechLabelSetting = lazy(() => import("./components/merchant_component/techbasedMerchant/LabelSetting"));
const RolePermission = lazy(() => import("./components/admin/RolePermission"));
const CreateAdmin = lazy(() => import("./components/admin/CreateAdmin"));
const UserLogin = lazy(() => import("./components/User/UserLogin"));
const UserAnalytics = lazy(() => import("./components/User/UserDashboard"));
const UserNDR = lazy(() => import("./components/User/NDR"));
const UserOrderDetails = lazy(() => import("./components/User/UserOrders"));
const Loader = lazy(() => import("./components/Loader"));
const ChatWidget = lazy(() => import("./components/daakit-chatbot"));

const LazyLoading = lazy(() => import("./components/LazyLoding"));

import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "./context/ThemeContext";

import { jwtDecode } from "jwt-decode";
import { UserRoles } from "@/utils/UserRole";
import BookOrders from "./components/admin/BookOrders";
import NewMappingOrders from "./components/admin/NewMappingOrders";
import AssignmentConsole from "./components/User/AssignmentConsole";
import UserProtectedRoute from "./components/ProtectedRoute/UserProtectedRoute";
import { ScrollToTop } from "./components/UiComponents/ScrollToTop";


const getLocalPermissions = () => {
  const stored = localStorage.getItem("permission");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    return stored;
  }
};

// Loading fallback component
const LoadingFallback = () => (
  <LazyLoading />
);

// Protected layout with Navbar
const ProtectedLayout = ({ allowedRoles, loading }) => {
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

const UserProtectedRouteLayout = ({ allowedRoles, loading, requiredPermission = [], permissions, children }) => {
  const currentPermissions = permissions ?? getLocalPermissions();
  if (loading) {
    return <Loader />;
  }
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UserProtectedRoute allowedRoles={allowedRoles} requiredPermission={requiredPermission} permissions={currentPermissions}>
        <Navbar allowedRoles={allowedRoles} permissions={currentPermissions}>
          {children}
        </Navbar>
      </UserProtectedRoute>
    </Suspense>
  );
};


function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [permissions, setPermissions] = useState(`${localStorage.getItem("permission")}`);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({})
  const appRouter = createBrowserRouter([

    {
      path: "/FestiveWisher",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <FestiveWisher />
        </Suspense>
      )
    },
    {
      path: "/register",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Register />
        </Suspense>
      )
    },
    {
      path: "/vendor/register",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <VendorRegistrationPage />
        </Suspense>
      )
    },
    {
      path: "/merchant-forgot-password",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ForgotPasswordMerchant />
        </Suspense>
      )
    },
    {
      path: "/vendor-forgot-password",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <VendorForgotPassword />
        </Suspense>
      )
    },
    {
      path: "/track-order",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <TrackAWBOrder />
        </Suspense>
      )
    },
    {
      path: "/unauthorized",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Unauthorized />
        </Suspense>
      )
    },
    {
      path: "/onRechargeSuccess",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <PaymentSuccess />
        </Suspense>
      )
    },
    {
      path: "/onRechargeFailure",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <PaymentFailed />
        </Suspense>
      )
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <Login />
        </Suspense>
      )
    },
    {
      path: "/login/admin",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminLogin />
        </Suspense>
      )
    },
    {
      path: "/login/user",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <UserLogin />
        </Suspense>
      )
    },
    {
      path: "/incognitoLogin/:token/:email/:role",
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <IncognitoLogin />
        </Suspense>
      )
    },
    // Admin routes
    {
      path: "/admin",
      element: <ProtectedLayout allowedRoles={['admin']} permissions={permissions} loading={loading} />,
      children: [
        { path: "analytics", element: <Suspense fallback={<LoadingFallback />}><Analytics /></Suspense> },
        { path: "order-details", element: <Suspense fallback={<LoadingFallback />}><OrderDetails /></Suspense> },
        { path: "order-assignment", element: <Suspense fallback={<LoadingFallback />}><OrderAssignment /></Suspense> },
        { path: "rider-onboarding", element: <Suspense fallback={<LoadingFallback />}><RiderOnboarding /></Suspense> },
        { path: "cod-remittances", element: <Suspense fallback={<LoadingFallback />}><CODRemittances /></Suspense> },
        { path: "vendor-remittances", element: <Suspense fallback={<LoadingFallback />}><RemittanceStatusVendor /></Suspense> },
        { path: "merchant-remittances", element: <Suspense fallback={<LoadingFallback />}><MerchantRemittances /></Suspense> },
        { path: "order-history", element: <Suspense fallback={<LoadingFallback />}><OrderHistory /></Suspense> },
        { path: "route-planning", element: <Suspense fallback={<LoadingFallback />}><RoutePlanning /></Suspense> },
        { path: "ndr", element: <Suspense fallback={<LoadingFallback />}><NDR /></Suspense> },
        { path: "merchant-details", element: <Suspense fallback={<LoadingFallback />}><MerchantDetails /></Suspense> },
        { path: "vendor-stats", element: <Suspense fallback={<LoadingFallback />}><VendorStats /></Suspense> },
        { path: "vendor-riders", element: <Suspense fallback={<LoadingFallback />}><VendorRiders /></Suspense> },
        { path: "order-tracking", element: <Suspense fallback={<LoadingFallback />}><OrderTracking /></Suspense> },
        { path: "history/:id", element: <Suspense fallback={<LoadingFallback />}><TrackOrder /></Suspense> },
        { path: "map", element: <Suspense fallback={<LoadingFallback />}><RidersMap /></Suspense> },
        { path: "subscription", element: <Suspense fallback={<LoadingFallback />}><Subscription /></Suspense> },
        { path: "add/coupon", element: <Suspense fallback={<LoadingFallback />}><CouponForm /></Suspense> },
        { path: "coupon", element: <Suspense fallback={<LoadingFallback />}><Coupon /></Suspense> },
        { path: "pricing", element: <Suspense fallback={<LoadingFallback />}><Pricing /></Suspense> },
        { path: "updatePlanDetails/:plan_id", element: <Suspense fallback={<LoadingFallback />}><UpdatePlanDetails /></Suspense> },
        { path: "role-permission", element: <Suspense fallback={<LoadingFallback />}><RolePermission /></Suspense> },
        { path: "add-user", element: <Suspense fallback={<LoadingFallback />}><CreateAdmin /></Suspense> },
        { path: "bookOrders", element: <Suspense fallback={<LoadingFallback />}><BookOrders /></Suspense> },
        { path: "orderNewMappings", element: <Suspense fallback={<LoadingFallback />}><NewMappingOrders /></Suspense> },
        { index: true, element: <Navigate to="analytics" /> },
      ],
    },


    {
      path: "/user/analytics",
      element: (
        <UserProtectedRouteLayout
          allowedRoles={UserRoles}
          requiredPermission={["DASHBOARD_VIEW", "ADMIN_FULL_ACCESS"]}
          permissions={permissions}
        >
          <UserAnalytics />
        </UserProtectedRouteLayout>
      )
    },
    {
      path: "/user/order-details",
      element: (
        <UserProtectedRouteLayout
          allowedRoles={UserRoles}
          permissions={permissions}
          requiredPermission={["ODR_VIEW", "ADMIN_FULL_ACCESS"]}
        >
          <UserOrderDetails />
        </UserProtectedRouteLayout>
      )
    },
    {
      path: "/user/ndr",
      element: (
        <UserProtectedRouteLayout
          allowedRoles={UserRoles}
          permissions={permissions}
          requiredPermission={["NDR_VIEW", "ADMIN_FULL_ACCESS"]}
        >
          <UserNDR />
        </UserProtectedRouteLayout>
      )
    },
    {
      path: "/user/assignemt/console",
      element: (
        <UserProtectedRouteLayout
          allowedRoles={UserRoles}
          permissions={permissions}
          requiredPermission={["VIEW_ASSN_CON", "ADMIN_FULL_ACCESS"]}
        >
          <AssignmentConsole />
        </UserProtectedRouteLayout>
      )
    },

    // User routes
    // {
    //   path: '/user',
    //   element: <ProtectedLayout allowedRoles={UserRoles} loading={loading} permissions={permissions} />,
    //   children: [
    //     { path: "analytics", element: <Suspense fallback={<LoadingFallback />}><UserAnalytics /></Suspense> },
    //     { path: "order-details", element: <Suspense fallback={<LoadingFallback />}><UserOrderDetails /></Suspense> },
    //     { path: "ndr", element: <Suspense fallback={<LoadingFallback />}><UserNDR /></Suspense> },
    //     { path: "assignemt/console", element: <Suspense fallback={<LoadingFallback />}><AssignmentConsole /></Suspense> },
    //     { index: true, element: <Navigate to="analytics" /> },
    //   ]
    // },

    // Vendor routes
    {
      path: "/vendor",
      element: <ProtectedLayout allowedRoles={['vendor']} permissions={permissions} loading={loading} />,
      children: [
        { path: "analytics", element: <Suspense fallback={<LoadingFallback />}><VendorAnalytics /></Suspense> },
        { path: "riders", element: <Suspense fallback={<LoadingFallback />}><VendorAllRiders /></Suspense> },
        { path: "cod-remittances", element: <Suspense fallback={<LoadingFallback />}><VendorCodRemittance /></Suspense> },
        { path: "remittance-record", element: <Suspense fallback={<LoadingFallback />}><VendorRemittanceRecord /></Suspense> },
        { path: "rider-orders", element: <Suspense fallback={<LoadingFallback />}><VendorOrderDetails /></Suspense> },
        { path: "mapped-orders", element: <Suspense fallback={<LoadingFallback />}><VendorMappedOrder /></Suspense> },
        { path: "rider-onboarding", element: <Suspense fallback={<LoadingFallback />}><VendorRiderOnboarding /></Suspense> },
        { path: "map", element: <Suspense fallback={<LoadingFallback />}><VendorRidersMap /></Suspense> },
        { path: "profile", element: <Suspense fallback={<LoadingFallback />}><VendorProfile /></Suspense> },
        { path: "rider_rate/list", element: <Suspense fallback={<LoadingFallback />}><RiderRateList /></Suspense> },
        { path: "rider_rate/create", element: <Suspense fallback={<LoadingFallback />}><CreateRider /></Suspense> },
        { path: "support", element: <Suspense fallback={<LoadingFallback />}><Support /></Suspense> },
        { path: "hub_list", element: <Suspense fallback={<LoadingFallback />}><HubList /></Suspense> },
        { path: "hub_create", element: <Suspense fallback={<LoadingFallback />}><CreateHub /></Suspense> },
        { index: true, element: <Navigate to="analytics" /> },
      ],
    },

    // Tech-based merchant routes
    {
      path: "/techbased_merchant",
      element: <ProtectedLayout allowedRoles={['merchant']} permissions={permissions} loading={loading} />,
      children: [
        { path: "analytics", element: <Suspense fallback={<LoadingFallback />}><TechMerchantAnalytics /></Suspense> },
        { path: "order-details", element: <Suspense fallback={<LoadingFallback />}><TechMerchantOrderDetails /></Suspense> },
        { path: "order-tracking", element: <Suspense fallback={<LoadingFallback />}><TechMerchantOrderTracking /></Suspense> },
        { path: "ndr", element: <Suspense fallback={<LoadingFallback />}><TechMerchantNDR /></Suspense> },
        { path: "cx", element: <Suspense fallback={<LoadingFallback />}><TechMerchantCX /></Suspense> },
        { path: "rider/onboarding", element: <Suspense fallback={<LoadingFallback />}><TechBasedOnBoarding /></Suspense> },
        { path: "rider/stats", element: <Suspense fallback={<LoadingFallback />}><TechBasedRiderStats /></Suspense> },
        { path: "rider/live_location", element: <Suspense fallback={<LoadingFallback />}><LiveLocation /></Suspense> },
        { path: "cod_emittances", element: <Suspense fallback={<LoadingFallback />}><TechCodRemittances /></Suspense> },
        { path: "codemittances", element: <Suspense fallback={<LoadingFallback />}><TechbasedMerchentRemittances /></Suspense> },

        { path: "recharge", element: <Suspense fallback={<LoadingFallback />}><Recharge /></Suspense> },
        { path: "profile", element: <Suspense fallback={<LoadingFallback />}><TechProfile /></Suspense> },
        { path: "transaction", element: <Suspense fallback={<LoadingFallback />}><TechbasedTransaction /></Suspense> },
        { path: "support", element: <Suspense fallback={<LoadingFallback />}><Support /></Suspense> },
        { path: "change-password", element: <Suspense fallback={<LoadingFallback />}><TechChangePassword /></Suspense> },
        { path: "security-key", element: <Suspense fallback={<LoadingFallback />}><TechSecurityKey /></Suspense> },
        { path: "rider/rate", element: <Suspense fallback={<LoadingFallback />}><CreateRiderRate /></Suspense> },
        { path: "rider_rate/list", element: <Suspense fallback={<LoadingFallback />}><RiderRates /></Suspense> },
        { path: "pricing/details", element: <Suspense fallback={<LoadingFallback />}><TechPriceDetails /></Suspense> },
        { path: "pricing/calculate", element: <Suspense fallback={<LoadingFallback />}><TechMerchantPricingCalculator /></Suspense> },
        { path: "label/setting", element: <Suspense fallback={<LoadingFallback />}><TechLabelSetting /></Suspense> },
        { path: "integration", element: <Suspense fallback={<LoadingFallback />}><TechIntegration /></Suspense> },

        { index: true, element: <Navigate to="analytics" /> },
      ]
    },

    // Regular merchant routes
    {
      path: "/merchant",
      element: <ProtectedLayout allowedRoles={['merchant']} permissions={permissions} loading={loading} />,
      children: [
        { path: "order-success", element: <Suspense fallback={<LoadingFallback />}><OrderSuccess /></Suspense> },
        { path: "analytics", element: <Suspense fallback={<LoadingFallback />}><MerchantAnalytics /></Suspense> },
        { path: "order-details", element: <Suspense fallback={<LoadingFallback />}><MerchantOrderDetails /></Suspense> },
        { path: "order-tracking", element: <Suspense fallback={<LoadingFallback />}><MerchantOrderTracking /></Suspense> },
        { path: "ndr", element: <Suspense fallback={<LoadingFallback />}><MerchantNDR /></Suspense> },
        { path: "remittance", element: <Suspense fallback={<LoadingFallback />}><MerchantCOD /></Suspense> },
        { path: "cx", element: <Suspense fallback={<LoadingFallback />}><MerchantCX /></Suspense> },
       

        { path: "create_order", element: <Suspense fallback={<LoadingFallback />}><CreateOrder /></Suspense> },
        { path: "bulk-upload", element: <Suspense fallback={<LoadingFallback />}><BulkUpload /></Suspense> },
        { path: "order-draft", element: <Suspense fallback={<LoadingFallback />}><DraftsList /></Suspense> },
        { path: "insurance", element: <Suspense fallback={<LoadingFallback />}><Insurance /></Suspense> },
        

        { path: "recharge", element: <Suspense fallback={<LoadingFallback />}><MerchantRecharge /></Suspense> },
        { path: "profile", element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense> },
        { path: "transaction", element: <Suspense fallback={<LoadingFallback />}><Transaction /></Suspense> },
        { path: "support", element: <Suspense fallback={<LoadingFallback />}><Support /></Suspense> },
        { path: "change-password", element: <Suspense fallback={<LoadingFallback />}><ChangePassword /></Suspense> },
        { path: "security-key", element: <Suspense fallback={<LoadingFallback />}><SecurityKey /></Suspense> },
        { path: "pricing/details", element: <Suspense fallback={<LoadingFallback />}><PriceDetails /></Suspense> },
        { path: "pricing/calculate", element: <Suspense fallback={<LoadingFallback />}><PriceCalculate /></Suspense> },
        { path: "label/setting", element: <Suspense fallback={<LoadingFallback />}><LabelSetting /></Suspense> },
        { path: "integration", element: <Suspense fallback={<LoadingFallback />}><Integration /></Suspense> },

        { index: true, element: <Navigate to="analytics" /> },
      ],
    },

    { path: "/", element: <Navigate to="/login" /> },
    { path: "*", element: <Suspense fallback={<LoadingFallback />}><Page404 /></Suspense> },
  ]);


  useEffect(() => {
    if (token) {

      try {
        const decoded = jwtDecode(token);
        setUser(decoded)
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.clear();

        window.location.href = "/login";
      }


    }

  }, [])


  return (
    <ThemeProvider>
      {/* <InspectController /> */}

      <RouterProvider router={appRouter}>
        <ScrollToTop />
      </RouterProvider>
      
          <ChatWidget />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
