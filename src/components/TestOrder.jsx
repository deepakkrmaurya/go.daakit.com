import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { FaBolt } from "react-icons/fa";
import DaakitIcon from "../assets/daakit-icon.png";
import DaakitGoLogo from "../assets/DaakitGo-Logo.jpg";
// Icons
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

const baseURL = import.meta.env.VITE_BASE_URL;


function Navbar({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const [isOpen, setIsOpen] = useState("");
  const [orders, setOrders] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  // Navigation items configuration
  const navConfig = {
    admin: [
      [<IoAnalyticsOutline className="h-5 w-5" />, "Analytics", "/admin/analytics"],
      [<TbPackage className="h-5 w-5" />, "All Orders", "/admin/order-details"],
      [<MdOutlineAssignment className="h-5 w-5" />, "Order Assignment", "/admin/order-assignment"],
      [<FaRoute className="h-5 w-5" />, "Route Planning", "/admin/route-planning"],
      [<FaMapMarkedAlt className="h-5 w-5" />, "Rider's Live Location", "/admin/map"],
      [<NoSymbolIcon className="h-5 w-5" />, "NDR", "/admin/ndr"],
      [<MdOutlineBusinessCenter className="h-5 w-5" />, "Merchant", "/admin/merchant-details"],
      [<MdOutlineSubscriptions className="h-5 w-5" />, "Subscription Plans", "/admin/subscription"],
      [<RiCoupon2Fill className="h-5 w-5" />, "Coupon", "/admin/coupon"],
      [<ImPriceTag className="h-5 w-5" />, "Pricing", "/admin/pricing"],
    ],
    vendor: [
      [<IoAnalyticsOutline className="h-5 w-5" />, "Dashboard", "/vendor/analytics"],
    ],
    merchant: decoded.tech_based !== '1' ? [
      [<IoAnalyticsOutline className="h-5 w-5" />, "Dashboard", "/merchant/analytics"],
      [<FaGears className="h-5 w-5" />, "CX", "/merchant/cx"],
    ] : [
      [<IoAnalyticsOutline className="h-5 w-5" />, "Dashboard", "/techbased_merchant/analytics"],
      [<FaGears className="h-5 w-5" />, "CX", "/techbased_merchant/cx"],
    ]
  };

  // Dropdown menus configuration
  const dropdownConfig = {
    admin: [
      {
        id: "remittances",
        icon: <FaIndianRupeeSign className="h-5 w-5" />,
        title: "Remittances",
        items: [
          [<LuReceiptIndianRupee className="h-4 w-4" />, "COD Remittances", "/admin/cod-remittances"],
          [<FaHandshake className="h-4 w-4" />, "Vendor Remittances", "/admin/vendor-remittances"],
          [<FaUserTie className="h-4 w-4" />, "Merchant Remittances", "/admin/merchant-remittances"],
        ]
      },
      {
        id: "vendor",
        icon: <FaHandshake className="h-5 w-5" />,
        title: "Vendor",
        items: [
          [<TbDeviceWatchStats className="h-4 w-4" />, "Vendor Stats", "/admin/vendor-stats"],
          [<MdDirectionsBike className="h-4 w-4" />, "Vendor Riders", "/admin/vendor-riders"],
        ]
      }
    ],
    vendor: [
      {
        id: "Operation",
        icon: <MdBuild className="h-5 w-5" />,
        title: "Operation",
        items: [
          [<TbPackage className="h-5 w-5" />, "Rider's Orders", "/vendor/rider-orders"],
        ]
      },
      {
        id: "finance",
        icon: <MdAccountBalance className="h-5 w-5" />,
        title: "Finance",
        items: [
          [<ImStatsBars2 className="h-5 w-5" />, "Remittance Record", "/vendor/remittance-record"],
        ]
      },
      {
        id: "rider",
        icon: <MdDirectionsBike className="h-5 w-5" />,
        title: "Rider",
        items: [
          [<MdDirectionsBike className="h-5 w-5" />, "Riders", "/vendor/riders"],
          [<FaIndianRupeeSign className="h-5 w-5" />, "COD Remittances", "/vendor/cod-remittances"],
          [<FaWpforms className="h-5 w-5" />, "Rider Onboarding", "/vendor/rider-onboarding"],
          [<FaMapMarkedAlt className="h-5 w-5" />, "Rider's Live Location", "/vendor/map"],
          [<LuReceiptIndianRupee className="h-4 w-4" />, "Rate List", "/vendor/rider_rate/list"],
        ]
      },
    ],
    merchant: decoded.tech_based === '1' ? [
      {
        id: "Operation",
        icon: <MdBuild className="h-5 w-5" />,
        title: "Operation",
        items: [
          [<TbPackage className="h-5 w-5" />, "All Orders", "/techbased_merchant/order-details"],
          [<NoSymbolIcon className="h-5 w-5" />, "NDR", "/techbased_merchant/ndr"],
        ]
      },
      {
        id: "finance",
        icon: <MdAccountBalance className="h-5 w-5" />,
        title: "Finance",
        items: [
          [<FaBolt className="h-5 w-5" />, "Recharge & Subscription", "/techbased_merchant/recharge"],
          [<FaMoneyBillTransfer className="h-5 w-5" />, "Transaction", "/techbased_merchant/transaction"],
          [<MdSwapHoriz className="h-5 w-5" />, "Remittances", "/techbased_merchant/codemittances"],
        ]
      },
      {
        id: "techbased",
        icon: <MdDirectionsBike className="h-5 w-5" />,
        title: "Riders",
        items: [
          [<FaUserTie className="h-4 w-4" />, "OnBoarding", "/techbased_merchant/rider/onboarding"],
          [<TbDeviceWatchStats className="h-4 w-4" />, "Stats", "/techbased_merchant/rider/stats"],
          [<FaMapMarkedAlt className="h-4 w-4" />, "Live Location", "/techbased_merchant/rider/live_location"],
          [<LuReceiptIndianRupee className="h-4 w-4" />, "COD Remittances", "/techbased_merchant/cod_emittances"],
          [<LuReceiptIndianRupee className="h-4 w-4" />, "Rate List", "/techbased_merchant/rider_rate/list"],
        ]
      },
      {
        id: "setting",
        icon: <MdOutlineSettings className="h-5 w-5" />,
        title: "Setting",
        items: [
          [<FaKey className="h-5 w-5" />, "Change Password", "/techbased_merchant/change-password"],
          [<FaShieldAlt className="h-5 w-5" />, "Security Key", "/techbased_merchant/security-key"],
        ]
      },
    ] : [
      {
        id: "Operation",
        icon: <MdBuild className="h-5 w-5" />,
        title: "Operation",
        items: [
          [<TbPackage className="h-5 w-5" />, "Create Turant Order", "/merchant/create_order/turant"],
          [<TbPackage className="h-5 w-5" />, "All Orders", "/merchant/order-details"],
          [<NoSymbolIcon className="h-5 w-5" />, "NDR", "/merchant/ndr"],
        ]
      },
      {
        id: "finance",
        icon: <MdAccountBalance className="h-5 w-5" />,
        title: "Finance",
        items: [
          [<FaBolt className="h-5 w-5" />, "Recharge", "/merchant/recharge"],
          [<FaMoneyBillTransfer className="h-5 w-5" />, "Transaction", "/merchant/transaction"],
          [<MdSwapHoriz className="h-5 w-5" />, "Remittances", "/merchant/remittance"],
        ]
      },
      {
        id: "setting",
        icon: <MdOutlineSettings className="h-5 w-5" />,
        title: "Setting",
        items: [
          [<FaKey className="h-5 w-5" />, "Change Password", "/merchant/change-password"],
          [<FaShieldAlt className="h-5 w-5" />, "Security Key", "/merchant/security-key"],
        ]
      },
    ]
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logout Successful");
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
      console.error("profile", error);
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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  const currentRole = allowedRoles?.includes("admin") ? "admin" :
    allowedRoles?.includes("vendor") ? "vendor" : "merchant";

  const navItems = navConfig[currentRole] || [];
  const dropdowns = dropdownConfig[currentRole] || [];

  useEffect(() => {
    if (decoded.tech_based === "1") {
      getTechMerchantProfile();
    } else if (decoded?.type === 'vendor') {
      getVendorProfile();
    } else {
      getMerchantProfile();
    }
  }, []);

  const placeholders = [
    "Search shipments...",
    "Enter AWB number...",
    "Track your order...",
  ];

  const [query, setQuery] = useState("");
  const [order, setOrder] = useState(null);
  const [close, Setclose] = useState(false);
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `${baseURL}/api/techbasedmerchant/getOrderDetailsByMerchant`,
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
    navigate("/techbased_merchant/order-tracking", {
      state: order,
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending pickup': return 'bg-yellow-100 text-yellow-800';
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'out for delivery': return 'bg-purple-100 text-purple-800';
      case 'booked': return 'bg-indigo-100 text-indigo-800';
      case 'undelivered': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[rgb(85,77,192)] text-white shadow-lg hover:bg-[rgb(75,67,182)] transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
    fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200
    transition-transform duration-300 ease-in-out z-40 flex flex-col overflow-hidden
    lg:static lg:z-auto lg:transform-none
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `}
      >
        {/* Logo Section - FIXED */}
        <div className="flex-shrink-0 flex items-center bg-[rgb(85,77,192)] px-4 py-3">
          <Link
            to={
              allowedRoles?.includes("admin")
                ? "/admin"
                : allowedRoles?.includes("vendor")
                  ? "/vendor"
                  : "/merchant"
            }
            className="flex items-center space-x-2"
            onClick={handleLinkClick}
          >
            <img
              src={DaakitIcon}
              alt="Daakit Logo"
              className="h-8 w-8"
            />
            <img
              src={DaakitGoLogo}
              alt="Daakit Go"
              className="h-6"
            />
          </Link>
        </div>

        {/* User Info - FIXED */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {profile?.profile_image ? (
              <img
                src={`${baseURL}/${profile.profile_image}`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <IoPersonCircleOutline className="w-10 h-10 text-[rgb(85,77,192)]" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {profile.company_name || profile.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {decoded?.email || 'Welcome'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-4 px-2 space-y-1">
            {navItems.map(([icon, name, path]) => (
              <Link
                key={name}
                to={path}
                onClick={handleLinkClick}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-[rgb(85,77,192,0.1)] hover:text-[rgb(85,77,192)] transition-colors"
              >
                <div className="text-[rgb(85,77,192)]">
                  {icon}
                </div>
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}

            {dropdowns.map((dropdown) => (
              <div key={dropdown.id} className="space-y-1">
                <button
                  onClick={() => setIsOpen(isOpen === dropdown.id ? "" : dropdown.id)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-[rgb(85,77,192,0.1)] hover:text-[rgb(85,77,192)] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-[rgb(85,77,192)]">
                      {dropdown.icon}
                    </div>
                    <span className="text-sm font-medium">{dropdown.title}</span>
                  </div>
                  {isOpen === dropdown.id ?
                    <CiCircleChevUp className="h-4 w-4" /> :
                    <CiCircleChevDown className="h-4 w-4" />
                  }
                </button>

                {isOpen === dropdown.id && (
                  <div className="ml-8 space-y-1 border-l-2 border-[rgb(85,77,192,0.2)] pl-4 py-1">
                    {dropdown.items.map(([icon, name, path]) => (
                      <Link
                        key={name}
                        to={path}
                        onClick={handleLinkClick}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-[rgb(85,77,192,0.1)] hover:text-[rgb(85,77,192)] transition-colors"
                      >
                        <div className="text-gray-500">
                          {icon}
                        </div>
                        <span className="text-sm">{name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {(decoded.type === 'vendor' || decoded.userType === 'merchant') && (
              <Link
                to={decoded.type === 'vendor' ? '/vendor/support' : '/techbased_merchant/support'}
                onClick={handleLinkClick}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-[rgb(85,77,192,0.1)] hover:text-[rgb(85,77,192)] transition-colors"
              >
                <LifeBuoy className="h-5 w-5 text-[rgb(85,77,192)]" />
                <span className="text-sm font-medium">Support</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Logout Button - FIXED AT BOTTOM */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 ">
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 lg:left-64 z-50 bg-[rgb(86,78,193)] shadow-lg">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4 h-14">
            {/* Mobile Menu Icon in Header */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden mr-4  p-2 rounded-lg text-white hover:bg-white/20 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}

            {/* <div className=" relative flex justify-between items-center  ">
                      <PlaceholdersAndVanishInput
                        placeholders={placeholders}
                        onChange={handleChange}
                        onSubmit={onSubmit}
                      />
                      {
                        (order !== null && close) && (
                          <div onClick={() => goToPage()} className=" absolute md:left-28  bg-green-100 rounded-full md:px-5    mt-1 ">
                            <div className="flex  items-center justify-center gap-4 text-sm sm:text-base w-full">
        
                              <span className=" flex  px-12 md:px-2 rounded py-1 gap-1 cursor-pointer">
                               
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-[rgb(86,78,193)] ">AWB:</span>
                                  <span className="text-green-400">
                                    {order?.order?.awb_number || "N/A"}
                                  </span>
                                </div>
        
                                
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-[rgb(86,78,193)]">Status:</span>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${order?.order?.status === "delivered"
                                      ? "bg-green-500"
                                      : order?.order?.status === "booked"
                                        ? "bg-green-500"
                                        : order?.order?.status === "cancelled"
                                          ? "bg-red-500"
                                          : order?.order?.status === "pending"
                                            ? "bg-blue-500"
                                            : "bg-green-500"
                                      }`}
                                  >
                                    {order?.order?.status || "Unknown"}
                                  </span>
                                </div>
        
                                
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-[rgb(86,78,193)]">City:</span>
                                  <span className=" text-green-500">{order?.order?.delivery_city || "N/A"}</span>
                                </div>
                              </span>
        
                            </div>
        
                          </div>
                        )
                      }
                    </div> */}
            <div className="relative flex md:-left-20  ">
              {/* {
                              decoded?.usertype !== "admin" || decoded.type !== 'vendor' && (
                                <PlaceholdersAndVanishInput
                                  placeholders={placeholders}
                                  onChange={handleChange}
                                  onSubmit={onSubmit}
                                />
                              )
                             } */}

              {!["admin", "vendor"].includes(decoded?.usertype || decoded?.type) && (
                <PlaceholdersAndVanishInput
                  placeholders={placeholders}
                  onChange={handleChange}
                  onSubmit={onSubmit}
                />
              )}



              {(order !== null && close) && (
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
                    {/* Close Button */}
                    <button
                      onClick={() => {
                        Setclose(false)
                      }}
                      className="
              absolute right-3 top-3 
              text-gray-400 hover:text-red-500 
              text-2xl transition-colors duration-200
              p-1 rounded-full hover:bg-red-50
            "
                    >
                      <IoCloseCircleSharp />
                    </button>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800">Order Details</h3>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4">
                      {/* AWB Number */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-bold">📦</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">AWB Number</p>
                            <p className="text-[rgb(86,78,193)] font-semibold text-sm">
                              {order?.order?.awb_number || "Not Assigned"}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Order Number */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-bold">#</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Order Number</p>
                            <p className="text-gray-800 font-semibold text-sm">
                              {order?.order?.orderno || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-gray-600 text-sm">📊</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Current Status</p>
                            <span
                              className={`
                      px-3 py-1.5 rounded-full text-xs font-semibold text-white
                      flex items-center gap-1.5
                      transition-all duration-300
                      ${order?.order?.status === "delivered"
                                  ? "bg-gradient-to-r from-green-500 to-green-600 shadow-green-200"
                                  : order?.order?.status === "booked"
                                    ? "bg-gradient-to-r from-green-500 to-green-600 shadow-green-200"
                                    : order?.order?.status === "cancelled"
                                      ? "bg-gradient-to-r from-red-500 to-red-600 shadow-red-200"
                                      : "bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-200"
                                }
                      shadow-lg
                    `}
                            >
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                              {order?.order?.status ?
                                order.order.status.charAt(0).toUpperCase() + order.order.status.slice(1)
                                : "Unknown"
                              }
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => goToPage()}
                          className="
                  text-blue-600 hover:text-white text-xs font-medium 
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
              {

                (decoded.role === 'merchant' || decoded?.userType === 'merchant') && (
                  <div className="hidden lg:block text-right">
                    <Link
                      to="/techbased_merchant/recharge"
                      className="flex items-center justify-center gap-1 text-xl text-white"
                    >
                      <span>Available Balance</span>
                      <FaIndianRupeeSign className="text-lg" />
                      <span>{parseInt(profile?.wallet_balance)}</span>
                    </Link>
                  </div>
                )

              }


              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                >
                  <User className="h-5 w-5 text-white" />
                </button>



                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">
                        {profile?.vendor_name || profile?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{decoded?.email}</p>
                    </div>

                    {/* {
                              decoded?.usertype! === 'admin' && (
                                {
                                  decoded?.type !== 'vendor' && (
                                  <Link
                                    to="/techbased_merchant/recharge"
                                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-700 font-medium">Available Balance</span>
                                    </div>
        
                                    <div className="flex items-center gap-1 text-gray-800 font-semibold">
                                      <MdOutlineCurrencyRupee className="text-lg" />
                                      <span>{parseInt(profile?.wallet_balance)}</span>
                                    </div>
                                  </Link>
                                )
                            }
                            {
                              decoded?.tech_based === '1' ? (
                                <Link
                                  to="/techbased_merchant/profile"
                                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                                >
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span>Profile</span>
                                </Link>
                              ) : decoded?.type === 'vendor' ? (
                                <>
                                  <Link
                                    to="/vendor/profile"
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                                  >
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span>Profile</span>
                                  </Link>
                                </>
                              ) : (
                                <Link
                                  to="/merchant/profile"
                                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                                >
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span>Profile</span>
                                </Link>
                              )
                            }
                            )
                             } */}

                    <>
                      {decoded?.usertype !== "admin" && (
                        <>
                          {/* PROFILE SECTION */}
                          {decoded?.tech_based === "1" ? (
                            <>
                              <div
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700 font-medium">Available Balance</span>
                                </div>

                                <div className="flex items-center gap-1 text-gray-800 font-semibold">
                                  <MdOutlineCurrencyRupee className="text-lg" />
                                  <span>{parseInt(profile?.wallet_balance)}</span>
                                </div>
                              </div>
                              <Link
                                to="/techbased_merchant/profile"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                              >
                                <User className="h-4 w-4 text-gray-500" />
                                <span>Profile</span>
                              </Link>
                            </>
                          ) : decoded?.type === "vendor" ? (

                            <Link
                              to="/vendor/profile"
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <User className="h-4 w-4 text-gray-500" />
                              <span>Profile</span>
                            </Link>
                          ) : (
                            <>
                              <div
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700 font-medium">Available Balance</span>
                                </div>

                                <div className="flex items-center gap-1 text-gray-800 font-semibold">
                                  <MdOutlineCurrencyRupee className="text-lg" />
                                  <span>{parseInt(profile?.wallet_balance)}</span>
                                </div>
                              </div>
                              <Link
                                to="/merchant/profile"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                              >
                                <User className="h-4 w-4 text-gray-500" />
                                <span>Profile</span>
                              </Link>
                            </>
                          )}
                        </>
                      )}
                    </>
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <User className="h-4 w-4 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>

                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 pt-20">
          <Outlet/>
        </main>
      </div>

    </div>
  );
}

export default Navbar;