
import { Outlet, Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User, Menu, X, ChevronRight, IndianRupee, Wallet } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { FaBolt, FaUser, FaUserPlus, FaUserShield } from "react-icons/fa";
import DaakitIcon from "../assets/daakit-icon.png";
import { MdAdminPanelSettings, MdLabel, MdOutlineMenuOpen,MdLink } from "react-icons/md";
import DaakitGoLogo from "../assets/DaakitGo-Logo.jpg";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

import {FaTruck} from "react-icons/fa";
import {MdWarehouse} from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaKey, FaShieldAlt } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { IoCloseCircleSharp } from "react-icons/io5";
import { LifeBuoy } from "lucide-react";
import { MdSwapHoriz } from "react-icons/md";
import { MdBuild } from "react-icons/md";
import { MdAccountBalance } from "react-icons/md";
import { RiCoupon2Fill } from "react-icons/ri";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { TbPackage } from "react-icons/tb";
import { MdOutlineAssignment } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaRoute } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { LuReceiptIndianRupee } from "react-icons/lu";
import { FaUserTie } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { TbDeviceWatchStats } from "react-icons/tb";
import { MdDirectionsBike } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { ImStatsBars2 } from "react-icons/im";
import { FaGears } from "react-icons/fa6";
import { toast } from "react-toastify";
import { MdOutlineSubscriptions } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { ImPriceTag } from "react-icons/im";
import axios from "axios";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { UserRoles } from "@/utils/UserRole";
import DaakitLogo from "../assets/logo-daakit.png";
import { DropdownMenuDemo } from "./UiComponents/NavDropdown";
const baseURL = import.meta.env.VITE_BASE_URL;
 const DaakitShieldIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 2.5 20 6v5.4c0 4.8-3.1 8.6-8 10.1-4.9-1.5-8-5.3-8-10.1V6l8-3.5Z"
        fill="#EAF2FF"
        stroke="#0756C9"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m8.2 12 2.4 2.4 5.2-5.4"
        stroke="#0756C9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
// Logo Components
const Logo = () => {
  return (
    <div className=" w-full flex bg-[#0446db] h-14  items-center justify-center mt-0 ">
      <Link
        to="#"
        className="relative z-20 flex  items-center space-x-2 py-1 text-sm font-normal text-white"
      >
        <img
          src={DaakitLogo}
          alt="Daakit Logo"
          className="h-8 w-auto shrink-0"
        />
        {/* <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium whitespace-pre text-black dark:text-white"
        >
          Daakit
        </motion.span> */}
      </Link>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className=" w-full flex bg-[#0446db] h-14 items-center justify-center mt-0 ">

      <Link
        to="#"
        className="relative z-20 flex  items-center space-x-2 py-1 text-sm font-normal text-white"
      >
        <img
          src={DaakitIcon}
          alt="Daakit Logo"
          className="h-8 w-8 shrink-0"
        />
      </Link>
    </div>
  );
};

function Navbar({ allowedRoles, children }) {
  const [open, setOpen] = useState(false);
  const [permissions, setPermissions] = useState(`${localStorage.getItem("permission")}`);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const [isOpen, setIsOpen] = useState("");
  const [orders, setOrders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const getUserPermissions = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPermissions(res?.data?.data?.data)

    } catch (error) {
      toast.error('')
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   if (UserRoles.includes(localStorage.getItem("userType"))) {
  //     getUserPermissions()
  //   }
  // }, [])

  // Navigation items configuration for SidebarLink format
  const getNavLinks = () => {
    const navConfig = {
      admin: [
        {
          label: "Analytics",
          href: "/admin/analytics",
          icon: <IoAnalyticsOutline className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Operation",
          href: "#",
          icon: <TbPackage className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Orders", href: "/admin/order-details", icon: <TbPackage className="h-4 w-4" /> },
            { label: "New Mapped Orders", href: "/admin/orderNewMappings", icon: <TbPackage className="h-4 w-4" /> },
          ]
        },
        {
          label: "Order History",
          href: "/admin/order-history",
          icon: <MdOutlineAssignment className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        // {
        //   label: "Route Planning",
        //   href: "/admin/route-planning",
        //   icon: <FaRoute className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        // },
        {
          label: "Rider's Live Location",
          href: "/admin/map",
          icon: <FaMapMarkedAlt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "NDR",
          href: "/admin/ndr",
          icon: <NoSymbolIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Merchant",
          href: "/admin/merchant-details",
          icon: <MdOutlineBusinessCenter className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        // {
        //   label: "Subscription Plans",
        //   href: "/admin/subscription",
        //   icon: <MdOutlineSubscriptions className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        // },
        {
          label: "Coupon",
          href: "/admin/coupon",
          icon: <RiCoupon2Fill className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Pricing",
          href: "/admin/pricing",
          icon: <ImPriceTag className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Remittances",
          href: "#",
          icon: <FaIndianRupeeSign className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "COD Remittances", href: "/admin/cod-remittances", icon: <LuReceiptIndianRupee className="h-4 w-4" /> },
            { label: "Vendor Remittances", href: "/admin/vendor-remittances", icon: <FaHandshake className="h-4 w-4" /> },
            { label: "Merchant Remittances", href: "/admin/merchant-remittances", icon: <FaUserTie className="h-4 w-4" /> },
          ]
        },
        {
          label: "Vendor",
          href: "#",
          icon: <FaHandshake className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Vendor Stats", href: "/admin/vendor-stats", icon: <TbDeviceWatchStats className="h-4 w-4" /> },
            { label: "Vendor Riders", href: "/admin/vendor-riders", icon: <MdDirectionsBike className="h-4 w-4" /> },
          ]
        },
        {
          label: "User",
          href: "#",
          icon: <FaUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Add New User", href: "/admin/add-user", icon: <FaUserPlus className="h-4 w-4" /> },
            { label: "Add Role & Permission", href: "/admin/role-permission", icon: <MdAdminPanelSettings className="h-4 w-4" /> },
          ]
        },
      ],
      user: [
        ...(permissions.includes('DASHBOARD_VIEW') || permissions.includes('ADMIN_FULL_ACCESS')
          ? [{
            label: "Dashboard",
            href: "/user/analytics",
            icon: <IoAnalyticsOutline className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          }] : []),
        ...(permissions.includes('ODR_VIEW') || permissions.includes('ADMIN_FULL_ACCESS')
          ? [{
            label: "All Orders",
            href: "/user/order-details",
            icon: <MdOutlineAssignment className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          }] : []),
        ...(permissions.includes('NDR_VIEW') || permissions.includes('ADMIN_FULL_ACCESS')
          ? [{
            label: "NDR",
            href: "/user/ndr",
            icon: <NoSymbolIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          }] : []),
      ],
      vendor: [
        {
          label: "Dashboard",
          href: "/vendor/analytics",
          icon: <IoAnalyticsOutline className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Operation",
          href: "#",
          icon: <MdBuild className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Orders", href: "/vendor/rider-orders", icon: <TbPackage className="h-4 w-4" /> },
            { label: "New Mapped Orders", href: "/vendor/mapped-orders", icon: <TbPackage className="h-4 w-4" /> },
          ]
        },
        {
          label: "Finance",
          href: "#",
          icon: <MdAccountBalance className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Remittance Record", href: "/vendor/remittance-record", icon: <ImStatsBars2 className="h-4 w-4" /> },
          ]
        },
        {
          label: "Rider",
          href: "#",
          icon: <MdDirectionsBike className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Riders", href: "/vendor/riders", icon: <MdDirectionsBike className="h-4 w-4" /> },
            { label: "COD Remittances", href: "/vendor/cod-remittances", icon: <FaIndianRupeeSign className="h-4 w-4" /> },
            { label: "Rider Onboarding", href: "/vendor/rider-onboarding", icon: <FaWpforms className="h-4 w-4" /> },
            { label: "Rider's Live Location", href: "/vendor/map", icon: <FaMapMarkedAlt className="h-4 w-4" /> },
            { label: "Rate List", href: "/vendor/rider_rate/list", icon: <LuReceiptIndianRupee className="h-4 w-4" /> },
          ]
        },
        {
          label: "Hub",
          href: "#",
          icon: <MdWarehouse className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Hub List", href: "/vendor/hub_list", icon: <FaTruck className="h-4 w-4" /> },
          ]
        },
        {
          label: "Support",
          href: "/vendor/support",
          icon: <LifeBuoy className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
      ],
      merchant: decoded.tech_based !== '1' ? [
        {
          label: "Dashboard",
          href: "/merchant/analytics",
          icon: <IoAnalyticsOutline className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Operation",
          href: "#",
          icon: <MdBuild className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "All Orders", href: "/merchant/order-details", icon: <TbPackage className="h-4 w-4" /> },
            { label: "Orders list", href: "/merchant/order-draft", icon: <TbPackage className="h-4 w-4" />},
            { label: "NDR", href: "/merchant/ndr", icon: <NoSymbolIcon className="h-4 w-4" /> },
          ]
        },
        {
          label: "CX",
          href: "/merchant/cx",
          icon: <FaGears className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Finance",
          href: "#",
          icon: <MdAccountBalance className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Recharge", href: "/merchant/recharge", icon: <FaBolt className="h-4 w-4" /> },
            { label: "Transaction", href: "/merchant/transaction", icon: <FaMoneyBillTransfer className="h-4 w-4" /> },
            { label: "Remittances", href: "/merchant/remittance", icon: <MdSwapHoriz className="h-4 w-4" /> },
            { label: "Pricing Plan", href: "/merchant/pricing/details", icon: <IndianRupee className="h-4 w-4" /> },
            { label: "Pricing Calculator", href: "/merchant/pricing/calculate", icon: <IndianRupee className="h-4 w-4" /> },
          ]
        },
        {
          label: "Setting",
          href: "#",
          icon: <MdOutlineSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Change Password", href: "/merchant/change-password", icon: <FaKey className="h-4 w-4" /> },
            { label: "Security Key", href: "/merchant/security-key", icon: <FaShieldAlt className="h-4 w-4" /> },
            { label: "Label Setting", href: "/merchant/label/setting", icon: <MdLabel className="h-4 w-4" /> },
            { label: "Integration", href: "/merchant/integration", icon: <MdLink className="h-4 w-4" /> },
            { label: "Insurance", href: "/merchant/insurance", icon: <DaakitShieldIcon className="h-4 w-4" />},

          ]
        },
      ] : [
        {
          label: "Dashboard",
          href: "/techbased_merchant/analytics",
          icon: <IoAnalyticsOutline className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "CX",
          href: "/techbased_merchant/cx",
          icon: <FaGears className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Operation",
          href: "#",
          icon: <MdBuild className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "All Orders", href: "/techbased_merchant/order-details", icon: <TbPackage className="h-4 w-4" /> },
            { label: "NDR", href: "/techbased_merchant/ndr", icon: <NoSymbolIcon className="h-4 w-4" /> },
          ]
        },
        {
          label: "Finance",
          href: "#",
          icon: <MdAccountBalance className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Recharge & Subscription", href: "/techbased_merchant/recharge", icon: <FaBolt className="h-4 w-4" /> },
            { label: "Transaction", href: "/techbased_merchant/transaction", icon: <FaMoneyBillTransfer className="h-4 w-4" /> },
            { label: "Remittances", href: "/techbased_merchant/codemittances", icon: <MdSwapHoriz className="h-4 w-4" /> },
            { label: "Pricing Plan", href: "/techbased_merchant/pricing/details", icon: <IndianRupee className="h-4 w-4" /> },
            { label: "Pricing Calculator", href: "/techbased_merchant/pricing/calculate", icon: <IndianRupee className="h-4 w-4" /> },
          ]
        },
        {
          label: "Riders",
          href: "#",
          icon: <MdDirectionsBike className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "OnBoarding", href: "/techbased_merchant/rider/onboarding", icon: <FaUserTie className="h-4 w-4" /> },
            { label: "Stats", href: "/techbased_merchant/rider/stats", icon: <TbDeviceWatchStats className="h-4 w-4" /> },
            { label: "Live Location", href: "/techbased_merchant/rider/live_location", icon: <FaMapMarkedAlt className="h-4 w-4" /> },
            { label: "COD Remittances", href: "/techbased_merchant/cod_emittances", icon: <LuReceiptIndianRupee className="h-4 w-4" /> },
            { label: "Rate List", href: "/techbased_merchant/rider_rate/list", icon: <LuReceiptIndianRupee className="h-4 w-4" /> },
          ]
        },
        {
          label: "Setting",
          href: "#",
          icon: <MdOutlineSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            { label: "Change Password", href: "/techbased_merchant/change-password", icon: <FaKey className="h-4 w-4" /> },
            { label: "Security Key", href: "/techbased_merchant/security-key", icon: <FaShieldAlt className="h-4 w-4" /> },
            { label: "Label Setting", href: "/techbased_merchant/label/setting", icon: <MdLabel className="h-4 w-4" /> },
                                    { label: "Integration", href: "/merchant/integration", icon: <MdLink className="h-4 w-4" /> },

          ]
        },
        {
          label: "Support",
          href: "/techbased_merchant/support",
          icon: <LifeBuoy className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
      ]
    };

    const currentRole = allowedRoles?.includes("admin") ? "admin" :
      allowedRoles?.includes("vendor") ? "vendor" :
        allowedRoles?.includes("user") ? 'user' : "merchant";

    return navConfig[currentRole] || [];
  };

  const clearStorageAndRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("permission");
    localStorage.clear();
  };

  const handleLogout = () => {
    try {
      const role = decoded.usertype || decoded.type || decoded.userType;

      if (role === "vendor") {
        clearStorageAndRedirect()
        navigate("/login");
      } else if (role === "admin") {
        clearStorageAndRedirect()
        navigate("/login/admin");
      } else if (UserRoles.includes(role)) {
        clearStorageAndRedirect()
        navigate("/login/user");
      } else {
        clearStorageAndRedirect()
        navigate("/login");
      }

      toast.success("Logout successful");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const getVendorProfile = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getVendorProfile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile(res.data.data);
    } catch (error) {

    }
  };

  const getTechMerchantProfile = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/techbasedmerchant/getMerchantProfile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile(res.data.data);
    } catch (error) {
      console.error("profile", error);
    }
  };

  const getMerchantProfile = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/merchant/getMerchantProfile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile(res.data.data);
    } catch (error) {
      console.error("profile", error);
    }
  };

  if (!token) {
    navigate("/login");
    toast.error("Session Expired!!!");
  }

  useEffect(() => {
    if (decoded.tech_based === "1") {
      getTechMerchantProfile();
    } else if (decoded.tech_based === "0") {
      getMerchantProfile();
    } else if (decoded?.type === 'vendor') {
      getVendorProfile();
    } else {
      return
    }
  }, []);

  const placeholders = [
    "Search shipments...",
    "Enter AWB number...",
    "Track your order...",
  ];

  const [query, setQuery] = useState("");
  const [close, Setclose] = useState(false);
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `${baseURL}/api/merchant/getOrderDetailsByMerchant`,
      {
        params: {
          awb_number: query,
          token: localStorage.getItem("token"),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setOrders(res.data || {});
    Setclose(true);
  };

  const goToPage = () => {
    Setclose(false);
    if (decoded.tech_based === "1") {
      navigate("/techbased_merchant/order-tracking", {
        state: orders,
      });
    } else if (decoded.tech_based === "0") {
      navigate("/merchant/order-tracking", {
        state: orders,
      });
    } else {
      return
    }
  };

  // Custom SidebarLink component that handles subitems
  const CustomSidebarLink = ({ link, isOpen }) => {
    const [showSubItems, setShowSubItems] = useState(false);

    if (link.subItems) {
      return (
        <div>
          <button
            onClick={() => setShowSubItems(!showSubItems)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200",
              "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
          >
            <div className="flex items-center gap-2">
              {link.icon}
              {isOpen && <span>{link.label}</span>}
            </div>
            {isOpen && (
              showSubItems ? <CiCircleChevUp className="h-4 w-4" /> : <CiCircleChevDown className="h-4 w-4" />
            )}
          </button>
          {isOpen && showSubItems && (
            <div className="ml-6 mt-1 space-y-1">
              {link.subItems.map((subItem, idx) => (
                <NavLink
                  key={idx}
                  to={subItem.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      isActive
                        ? "bg-[rgb(85,77,192,0.1)] text-[#0446DB]"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    )
                  }
                >
                  {subItem.icon}
                  <span>{subItem.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={link.href}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
            isActive
              ? "bg-[rgb(85,77,192,0.1)] text-[#0446DB]"
              : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          )
        }
      >
        {link.icon}
        {isOpen && <span>{link.label}</span>}
      </NavLink>
    );
  };

  const currentRole = allowedRoles?.includes("admin") ? "admin" :
    allowedRoles?.includes("vendor") ? "vendor" :
      allowedRoles?.includes("user") ? 'user' : "merchant";

  return (
    <div
      className={cn(
        "mx-auto flex flex-row overflow-hidden dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1  flex-col overflow-x-hidden overflow-y-auto">
            <div className={`flex items-center  bg-[#0446DB] ${open ? "justify-between px-4" : "justify-center"}`}>
              <div>{open ? <Logo /> : <LogoIcon />}</div>
              {open && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  className="md:hidden cursor-pointer text-white hover:text-white transition-colors p-1"
                >
                  <MdOutlineMenuOpen className="w-7 h-7" />
                  {/* <IoCloseCircleSharp className="w-7 h-7" /> */}
                </button>
              )}
            </div>
            <div className="flex-shrink-0 p-2 border-b border-gray-200 dark:border-[#0446DB]">
              <div className="flex items-center space-x-3">
                {profile?.profile_image ? (
                  <img
                    src={`${baseURL}/${profile.profile_image}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <IoPersonCircleOutline className="w-10 h-10 text-[#0446DB] flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {profile.company_name || profile.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white truncate">
                    {decoded?.email || 'Welcome'}
                  </p>
                </div>

              </div>
            </div>
            <div className="mt-0 flex flex-col gap-2">
              {getNavLinks().map((link, idx) => (
                <CustomSidebarLink key={idx} link={link} isOpen={open} />
              ))}
            </div>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg w-full text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800 transition-all duration-200"
            >
              <IconArrowLeft className="h-5 w-5 shrink-0" />
              {open && <span>Logout</span>}
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#0446DB] shadow-lg">

          <div className="flex items-center justify-between px-4 lg:px-6 py-4 h-14">
            {/* Search Bar */}
            <div className="relative flex flex-1 justify-center md:justify-start">
              {!["admin", "vendor", ...UserRoles].includes(decoded?.usertype || decoded?.type) && (
                <div className="w-full max-w-md">
                  <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    onChange={handleChange}
                    onSubmit={onSubmit}
                  />
                </div>
              )}

              {(orders !== null && close) && (
                <div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="
                      absolute left-0 right-0 top-16 
                      bg-white shadow-xl 
                      rounded-2xl border border-gray-100 
                      p-6 z-50 cursor-default 
                      animate-dropdown
                      md:w-[420px]
                      backdrop-blur-sm bg-white/95
                      transform transition-all duration-200
                      hover:shadow-2xl
                    "
                  >
                    <button
                      onClick={() => Setclose(false)}
                      className="
                        absolute right-3 top-3 
                        text-gray-400 hover:text-red-500 
                        text-2xl transition-colors duration-200
                        p-1 rounded-full hover:bg-red-50
                      "
                    >
                      <IoCloseCircleSharp />
                    </button>

                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800">Order Details</h3>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-bold">📦</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">AWB Number</p>
                            <p className="text-[#0446DB] font-semibold text-sm">
                              {orders?.order?.awb_number || "Not Assigned"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-bold">#</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Order Number</p>
                            <p className="text-gray-800 font-semibold text-sm">
                              {orders?.order?.orderno || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-gray-600 text-sm">📊</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Current Status</p>
                            <span
                              className={`
                                px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold text-white
                                flex items-center gap-1.5
                                transition-all duration-300
                                ${orders?.order?.status === "delivered"
                                  ? "bg-gradient-to-r from-green-500 to-green-600 shadow-green-200"
                                  : orders?.order?.status === "booked"
                                    ? "bg-gradient-to-r from-green-500 to-green-600 shadow-green-200"
                                    : orders?.order?.status === "cancelled"
                                      ? "bg-gradient-to-r from-red-500 to-red-600 shadow-red-200"
                                      : "bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-200"
                                }
                                shadow-lg
                              `}
                            >
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                              {orders?.order?.status ?
                                orders?.order?.status.charAt(0).toUpperCase() + orders?.order?.status.slice(1)
                                : "Unknown"
                              }
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => goToPage()}
                          className="
                            text-blue-600 hover:text-white whitespace-nowrap text-xs font-medium 
                            px-3 py-1.5 rounded-lg border border-blue-200 
                            hover:bg-blue-600 hover:border-blue-600 
                            transition-all duration-200
                            flex items-center gap-1
                          "
                        >
                          View Details
                          <span className="text-xs">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Info and Dropdown */}
            <div className="flex items-center gap-4">
              

              {/* ────── Available Balance (premium UI) ────── */}
              {(decoded.role === 'merchant' || decoded?.userType === 'merchant') && (
                <div className="hidden lg:block text-right">
                  <Link
                    to={
                      decoded?.tech_based === "1" ? "/techbased_merchant/recharge" : "/merchant/recharge"
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-gray-100 backdrop-blur-md border border-gray-200 px-4 py-1 text-sm font-medium text-gray-800 hover:bg-white/90 transition-all duration-200 hover:scale-105"
                  >
                    {/* Optional avatar – keep it if you want a personal touch */}

                    <Wallet className="w-6 h-6 text-gray-500" />


                    {/* Balance label */}
                    <span className="flex items-center gap-1">
                      <FaIndianRupeeSign className="text-lg text-green-600" />
                      <span>{parseInt(profile?.wallet_balance)}</span>
                      {/* <span className="ml-1 text-gray-500">Available</span> */}
                    </span>
                  </Link>
                </div>
              )}
              <DropdownMenuDemo
                profile={profile}
                decoded={decoded}
                UserRoles={UserRoles}
                handleLogout={handleLogout}
              />

              

            </div>

          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-0">
          {children ?? <Outlet />}
          
        </main>
      </div>
    </div>
  );
}

export default Navbar;
