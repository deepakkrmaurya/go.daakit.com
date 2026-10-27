

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load all components
const Register = lazy(() => import("./components/auth/Register"));
const Login = lazy(() => import("./components/auth/Login"));
const Analytics = lazy(() => import("./components/admin/dasboard/Analytics"));
const Navbar = lazy(() => import("./components/layout/Navbar"));
const OrderDetails = lazy(() => import("./components/admin/order/OrderDetails"));
const CODRemittances = lazy(() => import("./components/admin/CODRemittances"));
const RiderOnboarding = lazy(() => import("./components/admin/RiderOnboarding"));
const OrderAssignment = lazy(() => import("./components/admin/OrderAssignment"));
const RoutePlanning = lazy(() => import("./components/admin/RoutePlanning"));
const NDR = lazy(() => import("./components/admin/ndr/NDR"));
const VendorStats = lazy(() => import("./components/admin/VendorStats"));
const ProtectedRoute = lazy(() => import("./components/layout/ProtectedRoute"));
const VendorRiders = lazy(() => import("./components/admin/VendorRiders"));
const VendorAnalytics = lazy(() => import("./components/vendor_components/VendorAnalytics"));
const DCAnalytics = lazy(() => import("./components/distributionCenter/Dashboard/DcAnalytics"));
const VendorAllRiders = lazy(() => import("./components/vendor_components/rider/VendorAllRiders"));
const DcAllRiders = lazy(() => import("./components/distributionCenter/rider/DcAllRiders"));
const DcVendorOnboarding = lazy(() => import("./components/distributionCenter/vendor/DcVendorOnboarding"));
const VendorCodRemittance = lazy(() => import("./components/vendor_components/remittance/VendorCodRemittance"));
const DcCodRemittance = lazy(() => import("./components/distributionCenter/remmitance/DcCodRemittance"));
const VendorOrderDetails = lazy(() => import("./components/vendor_components/order/VendorOrderDetails"));
const DCOrderDetails = lazy(() => import("./components/distributionCenter/order/DcOrders"));
const VendorMappedOrder = lazy(() => import("./components/vendor_components/order/VendorMappedOrder"));
const VendorRiderOnboarding = lazy(() => import("./components/vendor_components/rider/VendorRiderOnboarding"));
const DcRiderOnboarding = lazy(() => import("./components/distributionCenter/rider/DcRiderOnboarding"));
const OrderTracking = lazy(() => import("./components/OrderTracking"));
const TrackOrder = lazy(() => import("./components/TrackOrder"));
const MerchantAnalytics = lazy(() => import("./components/merchant_component/merchant/dashboard/MerchantAnalytics"));
const MerchantOrderTracking = lazy(() => import("./components/merchant_component/MerchantOrderTracking"));
const MerchantNDR = lazy(() => import("./components/merchant_component/merchant/ndr/MerchantNDR"));
const MerchantRemittances = lazy(() => import("./components/admin/MerchantRemittances"));
const MerchantDetails = lazy(() => import("./components/admin/MerchantDetails"));
const MerchantCOD = lazy(() => import("./components/merchant_component/MerchantCOD"));
const TrackAWBOrder = lazy(() => import("./components/TrackAWBOrder"));
const RemittanceStatusVendor = lazy(() => import("./components/admin/remittance/RemittanceStatusVendor"));
const VendorRemittanceRecord = lazy(() => import("./components/vendor_components/remittance/VendorRemittanceRecord"));
const DcRemittanceRecord = lazy(() => import("./components/distributionCenter/remmitance/DcRemittanceRecord"));
const DcVendorRemittanceRecord = lazy(() => import("./components/distributionCenter/remmitance/VendorRemmitanceRecord"));
const RidersMap = lazy(() => import("./components/admin/RidersMap"));
const VendorRidersMap = lazy(() => import("./components/vendor_components/VendorRidersMap"));
const MerchantCX = lazy(() => import("./components/merchant_component/MerchantCX"));
const IncognitoLogin = lazy(() => import("./components/IncognitoLogin"));
const MerchantOrderDetails = lazy(() => import("./components/merchant_component/merchant/order/MerchantOrderDetails"));
const LiveLocation = lazy(() => import("./components/merchant_component/techbasedMerchant/riders/LiveLocation"));
const Subscription = lazy(() => import("./components/admin/couponSub/Subscription"));
const TechMerchantOrderDetails = lazy(() => import("./components/merchant_component/techbasedMerchant/order/TechMerchantOrderDetails"));
const TechMerchantAnalytics = lazy(() => import("./components/merchant_component/techbasedMerchant/TechMerchantAnalytics"));
const TechMerchantOrderTracking = lazy(() => import("./components/merchant_component/techbasedMerchant/TechMerchantOrderTracking"));
const TechMerchantNDR = lazy(() => import("./components/merchant_component/techbasedMerchant/ndr/TechMerchantNDR"));
const TechMerchantCX = lazy(() => import("./components/merchant_component/techbasedMerchant/TechMerchantCX"));
const TechBasedOnBoarding = lazy(() => import("./components/merchant_component/techbasedMerchant/riders/TechBasedOnBoarding"));
const TechBasedRiderStats = lazy(() => import("./components/merchant_component/techbasedMerchant/riders/TechBasedRiderStats"));
const TechCreateOrder = lazy(() => import("./components/merchant_component/techbasedMerchant/order/CreateOrder"));
const CreateOrder = lazy(() => import("./components/merchant_component/CreateOrder"));
const BulkUpload = lazy(() => import("./components/merchant_component/BulkUpload"));
const DraftsList = lazy(() => import("./components/merchant_component/merchant/order/DraftsList"));
const Insurance  = lazy(() => import("./components/merchant_component/Insurance"));
const Recharge = lazy(() => import("./components/merchant_component/techbasedMerchant/recharge/Recharge"));
const PaymentSuccess = lazy(() => import("./components/merchant_component/techbasedMerchant/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./components/merchant_component/techbasedMerchant/paymentFaild"));
const TechCodRemittances = lazy(() => import("./components/merchant_component/techbasedMerchant/pricing/TechCodRemittances"));
const CouponForm = lazy(() => import("./components/admin/couponSub/CouponForm"));
const Coupon = lazy(() => import("./components/admin/couponSub/Coupon"));
const Pricing = lazy(() => import("./components/admin/pricing/PricingPlans"));
const UpdatePlanDetails = lazy(() => import("./components/admin/pricing/UpdatePlanDetails"));
const TechbasedMerchentRemittances = lazy(() => import("./components/merchant_component/techbasedMerchant/remittances/TechbasedMerchentRemittances"));
const TechProfile = lazy(() => import("./components/merchant_component/techbasedMerchant/profile/TechProfile"));
const Profile = lazy(() => import("./components/merchant_component/Profile"));
const TechbasedTransaction = lazy(() => import("./components/merchant_component/techbasedMerchant/TechbasedTransaction"));
const Transaction = lazy(() => import("./components/merchant_component/history/Transaction"));
const Support = lazy(() => import("./components/merchant_component/Support"));
const ForgotPasswordMerchant = lazy(() => import("./components/auth/FotgotPasswordMerchant"));
const VendorForgotPassword = lazy(() => import("./components/auth/VendorForgotPassword"));
const VendorRegistrationPage = lazy(() => import("./components/auth/VendorRegiater"));
const ChangePassword = lazy(() => import("./components/merchant_component/ChangePassword"));
const SecurityKey = lazy(() => import("./components/merchant_component/SecurityKey"));
const Integration = lazy(() => import("./components/merchant_component/Integration"));

const TechChangePassword = lazy(() => import("./components/merchant_component/techbasedMerchant/chnagepassword/TechChangePassword"));
const TechSecurityKey = lazy(() => import("./components/merchant_component/techbasedMerchant/TechSecurityKey"));
const TechIntegration = lazy(() => import("./components/merchant_component/techbasedMerchant/Integration"));

const Unauthorized = lazy(() => import("./components/Unauthorized"));
const CreateRiderRate = lazy(() => import("./components/merchant_component/techbasedMerchant/rate/CreateRiderRate"));
const RiderRates = lazy(() => import("./components/merchant_component/techbasedMerchant/rate/RiderRates"));
const VendorProfile = lazy(() => import("./components/vendor_components/VendorProfile"));
const RiderRateList = lazy(() => import("./components/vendor_components/rate/RiderRateList"));
const CreateRider = lazy(() => import("./components/vendor_components/rate/CreateRate"));
const AdminLogin = lazy(() => import("./components/auth/AdminLogin"));
const Page404 = lazy(() => import("./components/Page404"));
const OrderSuccess = lazy(() => import("./components/OrderSuccess"));
const HubList = lazy(() => import("./components/vendor_components/hub/HubList"));
const DcHubList = lazy(() => import("./components/distributionCenter/hub/HubList"));
const CreateHub = lazy(() => import("./components/vendor_components/hub/CreateHub"));
const DcCreateHub = lazy(() => import("./components/distributionCenter/hub/DcHubOnboarding"));
const OrderHistory = lazy(() => import("./components/admin/order/OrderHistory"));
const PriceDetails = lazy(() => import("./components/merchant_component/PriceDetails"));
const MerchantRecharge = lazy(() => import("./components/merchant_component/Recharge"));
const PriceCalculate = lazy(() => import("./components/merchant_component/PriceCalculate"));
const TechMerchantPricingCalculator = lazy(() => import("./components/merchant_component/techbasedMerchant/pricing/PricingCalculater"));
const TechPriceDetails = lazy(() => import("./components/merchant_component/techbasedMerchant/pricing/PriceDetails"));
const LabelSetting = lazy(() => import("./components/merchant_component/LabelSetting"));
const TechLabelSetting = lazy(() => import("./components/merchant_component/techbasedMerchant/LabelSetting"));
const RolePermission = lazy(() => import("./components/admin/RolePermission"));
const CreateAdmin = lazy(() => import("./components/admin/CreateAdmin"));
const UserLogin = lazy(() => import("./components/auth/UserLogin"));
const UserAnalytics = lazy(() => import("./components/User/UserDashboard"));
const UserNDR = lazy(() => import("./components/User/NDR"));
const UserOrderDetails = lazy(() => import("./components/User/UserOrders"));
const Loader = lazy(() => import("./components/Loader"));
const ChatWidget = lazy(() => import("./components/daakit-chatbot"));

const LazyLoading = lazy(() => import("./components/layout/LazyLoding"));

import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "./context/ThemeContext";

import { jwtDecode } from "jwt-decode";
import { UserRoles } from "@/utils/UserRole";
import BookOrders from "./components/admin/order/BookOrders";
import NewMappingOrders from "./components/admin/order/NewMappingOrders";
import AssignmentConsole from "./components/User/AssignmentConsole";
import UserProtectedRoute from "./components/ProtectedRoute/UserProtectedRoute";
import { ScrollToTop } from "./components/UiComponents/ScrollToTop";
import ShipmentTracking from "./components/vendor_components/ShipmentTracking";
import TeachDraftsList from "./components/merchant_component/techbasedMerchant/order/DraftOrder";
import TeachBulkUpload from "./components/merchant_component/techbasedMerchant/order/BulkUpload";
import BillingAndInvoices from "./components/admin/BillingAndInvoices";
import Billing from "./components/merchant_component/merchant/billing/Billing";
import IntegrateChannel from "./components/merchant_component/merchant/channel/IntegrateChannel";
import ChannelList from "./components/merchant_component/merchant/channel/ChannelList";
import AddShopifyDetails from "./components/merchant_component/merchant/channel/AddShopifyDetails";
import RidrShipmentTracking from "./components/merchant_component/techbasedMerchant/riders/riderOrderTracking";
import TechInsurance from "./components/merchant_component/techbasedMerchant/insurance/Techinsurance";
import DcUserLogin from "./components/auth/DcLogin";
import DevAnalytics from "./components/admin/dev/DevAnalytics";
import DistributionCenterOnboarding from "./components/admin/dc/DistributionCenterOnboarding";
import DistributionCenterListing from "./components/admin/dc/DistributionCenterListing";
import WeightDiscrepancies from "./components/merchant_component/WeightDiscrepancies";
import WeightMIS from "./components/admin/WeightReconciliation/WeightMIS";
import Dispute from "./components/admin/WeightReconciliation/Dispute";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";
import DcVendorListing from "./components/distributionCenter/vendor/DcVendorListing";
import InspectController from "./Helper/InspectController";
import  WeightReconciliation  from "./components/admin/WeightReconciliation/WeightReconciliation";
import DcLoadout from "./components/distributionCenter/order/DcLoadout";
import VendorLoadout from "./components/vendor_components/order/VendorLoadout";


// const getLocalPermissions = () => {
//   const stored = localStorage.getItem("permission");
//   if (!stored) return [];
//   try {
//     return JSON.parse(stored);
//   } catch (error) {
//     return stored;
//   }
// };

// Loading fallback component
const LoadingFallback = () => (
  <LazyLoading />
);

// Protected layout with Navbar
// const ProtectedLayout = ({ allowedRoles, loading }) => {
//   const currentPermissions = getLocalPermissions();

//   if (loading || currentPermissions === null) {
//     return <Loader />;
//   }
//   return (
//     <Suspense fallback={<LoadingFallback />}>
//       <ProtectedRoute allowedRoles={allowedRoles} permissions={currentPermissions}>
//         <Navbar allowedRoles={allowedRoles} permissions={currentPermissions} />
//       </ProtectedRoute>
//     </Suspense>
//   );
// };

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

    
    
    {path: "/register",element: (<Suspense fallback={<LoadingFallback />}><Register /></Suspense>)},
    { path: "/vendor/register", element: ( <Suspense fallback={<LoadingFallback />}><VendorRegistrationPage /></Suspense>)},
    { path: "/merchant-forgot-password", element: (<Suspense fallback={<LoadingFallback />}><ForgotPasswordMerchant /></Suspense> )},
    {path: "/vendor-forgot-password",element: ( <Suspense fallback={<LoadingFallback />}> <VendorForgotPassword /></Suspense>)},
    { path: "/track-order", element: ( <Suspense fallback={<LoadingFallback />}> <TrackAWBOrder /> </Suspense>)},
    { path: "/unauthorized", element: (<Suspense fallback={<LoadingFallback />}> <Unauthorized /> </Suspense>)},
    { path: "/onRechargeSuccess", element: ( <Suspense fallback={<LoadingFallback />}><PaymentSuccess /></Suspense>) },
    { path: "/onRechargeFailure", element: ( <Suspense fallback={<LoadingFallback />}> <PaymentFailed /> </Suspense> )},
    { path: "/login",element: (<Suspense fallback={<LoadingFallback />}><Login /></Suspense>)},
    { path: "/login/dc",element: (<Suspense fallback={<LoadingFallback />}><DcUserLogin /></Suspense>)},
    { path: "/login/admin",element: (<Suspense fallback={<LoadingFallback />}><AdminLogin /></Suspense>)},
    { path: "/login/user", element: (<Suspense fallback={<LoadingFallback />}><UserLogin /></Suspense>)},
    { path: "/incognitoLogin/:token/:email/:role", element: ( <Suspense fallback={<LoadingFallback />}> <IncognitoLogin /></Suspense>)},
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
        // { path: "orderNewMappings", element: <Suspense fallback={<LoadingFallback />}><NewMappingOrders /></Suspense> },
        { path: "billingandinvoices", element: <Suspense fallback={<LoadingFallback />}><BillingAndInvoices /></Suspense> },
        { path: "dev/analytics", element: <Suspense fallback={<LoadingFallback />}><DevAnalytics /></Suspense> },
        { path: "onboarding/distribution-center", element: <Suspense fallback={<LoadingFallback />}><DistributionCenterOnboarding /></Suspense> },



        { path: "weight/reconciliation", element: <Suspense fallback={<LoadingFallback />}><WeightReconciliation /></Suspense> },
        // { path: "weightMIS", element: <Suspense fallback={<LoadingFallback />}><WeightMIS /></Suspense> },
        // { path: "dispute", element: <Suspense fallback={<LoadingFallback />}><Dispute /></Suspense> },
        // dc
        { path: "dc/list", element: <Suspense fallback={<LoadingFallback />}><DistributionCenterListing /></Suspense> },
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
        { path: "shipment-tracking", element: <Suspense fallback={<LoadingFallback />}><ShipmentTracking /></Suspense> },
        { path: "loadout", element: <Suspense fallback={<LoadingFallback />}><VendorLoadout /></Suspense> },
        { index: true, element: <Navigate to="analytics" /> },
      ],
    },
    
    {
      path: "/dc",
      element: <ProtectedLayout allowedRoles={['dc']} permissions={permissions} loading={loading} />,
      children: [
        { path: "analytics", element: <Suspense fallback={<LoadingFallback />}><DCAnalytics /></Suspense> },
        { path: "riders", element: <Suspense fallback={<LoadingFallback />}><DcAllRiders /></Suspense> },
        { path: "vendor/on-boarding", element: <Suspense fallback={<LoadingFallback />}><DcVendorOnboarding /></Suspense> },
        { path: "vendor/listing", element: <Suspense fallback={<LoadingFallback />}><DcVendorListing /></Suspense> },
        { path: "cod-remittances", element: <Suspense fallback={<LoadingFallback />}><DcCodRemittance /></Suspense> },
        { path: "remittance-record", element: <Suspense fallback={<LoadingFallback />}><DcRemittanceRecord /></Suspense> },
        { path: "vendor/remittance-record", element: <Suspense fallback={<LoadingFallback />}><DcVendorRemittanceRecord /></Suspense> },
        { path: "rider-orders", element: <Suspense fallback={<LoadingFallback />}><DCOrderDetails /></Suspense> },
        { path: "loadout", element: <Suspense fallback={<LoadingFallback />}><DcLoadout /></Suspense> },
        { path: "mapped-orders", element: <Suspense fallback={<LoadingFallback />}><VendorMappedOrder /></Suspense> },
        { path: "rider-onboarding", element: <Suspense fallback={<LoadingFallback />}><DcRiderOnboarding /></Suspense> },
        { path: "map", element: <Suspense fallback={<LoadingFallback />}><VendorRidersMap /></Suspense> },
        { path: "profile", element: <Suspense fallback={<LoadingFallback />}><VendorProfile /></Suspense> },
        { path: "rider_rate/list", element: <Suspense fallback={<LoadingFallback />}><RiderRateList /></Suspense> },
        { path: "rider_rate/create", element: <Suspense fallback={<LoadingFallback />}><CreateRider /></Suspense> },
        { path: "support", element: <Suspense fallback={<LoadingFallback />}><Support /></Suspense> },
        { path: "hub_list", element: <Suspense fallback={<LoadingFallback />}><DcHubList /></Suspense> },
        { path: "hub_create", element: <Suspense fallback={<LoadingFallback />}><DcCreateHub /></Suspense> },
        { path: "shipment-tracking", element: <Suspense fallback={<LoadingFallback />}><ShipmentTracking /></Suspense> },
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
        { path: "cod_remittances", element: <Suspense fallback={<LoadingFallback />}><TechCodRemittances /></Suspense> },
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

        { path: "create_order", element: <Suspense fallback={<LoadingFallback />}><TechCreateOrder /></Suspense> },
        { path: "order-draft", element: <Suspense fallback={<LoadingFallback />}><TeachDraftsList /></Suspense> },
        { path: "bulk-upload", element: <Suspense fallback={<LoadingFallback />}><TeachBulkUpload /></Suspense> },



        { path: "rider/shipment/tracking", element: <Suspense fallback={<LoadingFallback />}><RidrShipmentTracking /></Suspense> },
        { path: "insurance", element: <Suspense fallback={<LoadingFallback />}><TechInsurance /></Suspense> },
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
        { path: "billing", element: <Suspense fallback={<LoadingFallback />}><Billing /></Suspense> },
        { path: "create_order", element: <Suspense fallback={<LoadingFallback />}><CreateOrder /></Suspense> },
        { path: "bulk-upload", element: <Suspense fallback={<LoadingFallback />}><BulkUpload /></Suspense> },
        { path: "order-draft", element: <Suspense fallback={<LoadingFallback />}><DraftsList /></Suspense> },
        { path: "insurance", element: <Suspense fallback={<LoadingFallback />}><Insurance /></Suspense> },
        { path: "weight", element: <Suspense fallback={<LoadingFallback />}><WeightDiscrepancies /></Suspense> },

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


        { path: "channels", element: <Suspense fallback={<LoadingFallback />}><ChannelList /></Suspense> },
        { path: "channels/integrate", element: <Suspense fallback={<LoadingFallback />}><IntegrateChannel /></Suspense> },
        { path: "channels/shopify", element: <Suspense fallback={<LoadingFallback />}><AddShopifyDetails  /></Suspense> },


        

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
