import { Outlet, Link, NavLink } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import {
  User,
  ChevronDown,
  IndianRupee,
  Wallet,
  Bell,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Weight,
  HandCoins,
  Box,
  SlidersHorizontal,
  Network,
} from "lucide-react";

import { useEffect, useState, useRef } from "react";

import { FaBolt, FaStore, FaUser, FaUserPlus, FaUserShield, FaWarehouse } from "react-icons/fa";

import DaakitIcon from "@/assets/logo-1.png";

import DaakitIcon2 from "@/assets/logo-2.png";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

import { motion } from "motion/react";

import {
  MdAdminPanelSettings,
  MdLabel,
  MdLink,
  MdWarehouse,
  MdOutlineSettings,
  MdSwapHoriz,
  MdBuild,
  MdAccountBalance,
  MdOutlineBusinessCenter,
  MdOutlineAssignment,
  MdDirectionsBike,
  MdCardMembership,
  MdOutlineSubscriptions,
  MdOutlineScale,
  MdPersonAddAlt1,
  MdOutlineAppRegistration,
  MdOutlineAssessment,
  MdOutlineTwoWheeler,
  MdOutlineStorefront,
} from "react-icons/md";

import { DropdownMenuDemo } from "../UiComponents/NavDropdown";

import { FaTruck } from "react-icons/fa";

import { FaKey, FaShieldAlt } from "react-icons/fa";

import { LifeBuoy } from "lucide-react";

import { RiCoupon2Fill } from "react-icons/ri";

import { IoAnalyticsOutline, IoHomeOutline } from "react-icons/io5";

import {
  TbChartBar,
  TbClipboardSearch,
  TbMotorbike,
  TbPackage,
  TbPackageOff,
} from "react-icons/tb";

import { FaIndianRupeeSign, FaUsersGear } from "react-icons/fa6";

import { FaMapMarkedAlt } from "react-icons/fa";

import { NoSymbolIcon } from "@heroicons/react/24/outline";

import { LuPackageOpen, LuReceiptIndianRupee } from "react-icons/lu";

import { FaUserTie } from "react-icons/fa";

import { FaWpforms } from "react-icons/fa";

import { FaHandshake } from "react-icons/fa6";

import { TbDeviceWatchStats } from "react-icons/tb";

import { FaMoneyBillTransfer } from "react-icons/fa6";

import { ImStatsBars2 } from "react-icons/im";

import { FaGears } from "react-icons/fa6";

import { toast } from "react-toastify";

import { jwtDecode } from "jwt-decode";

import { ImPriceTag } from "react-icons/im";

import { CiDeliveryTruck } from "react-icons/ci";

import axios from "axios";

import { UserRoles } from "@/utils/UserRole";

import DaakitLogo from "@/assets/logo-daakit.png";

import AxiosInstance from "@/Helper/axiosInstance";

import GlassSurface from "../UiComponents/GlassSurface";
import { FiAlertTriangle, FiMonitor, FiSettings } from "react-icons/fi";
import OrderSearch from "../common/InputGroupDropdown";
import {
  DashboardIcon,
  FinanceIcon,
  OperationIcon,
  MapOrderIcon,
  OrderIcon,
  RemittanceIcon,
  RiderLocationIcon,
  RateListIcon,
  RatePerIcon,
  HubIcon,
  SupportIcon,
  TransactionIcon,
  RechargeIcon,
  PricingPlanIcon,
  PricingCalcuIcon,
  ChnagePasswordIcon,
  SecurityKeyIcon,
  LabelIcon,
  InsuranceIcon,
  SettingIcon,
  AssignedPickupsIcon,
  LoadoutIcon,
  VASIcon,
  ETAWidget,
} from "../common/svg/Icons";

const baseURL = import.meta.env.VITE_BASE_URL;

const cn = (...classes) => classes.filter(Boolean).join(" ");

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

const BillingIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www\\.w3.org/2000/svg"
    >
      <path
        d="M17.625 21.0001C17.9349 20.7245 18.3353 20.5723 18.75 20.5723C19.1647 20.5723 19.5651 20.7245 19.875 21.0001C19.9724 21.0866 20.0927 21.1432 20.2215 21.1629C20.3502 21.1827 20.482 21.1648 20.6008 21.1115C20.7197 21.0581 20.8206 20.9716 20.8914 20.8622C20.9622 20.7529 20.9999 20.6254 21 20.4951V3.50511C20.9999 3.37483 20.9622 3.24735 20.8914 3.138C20.8206 3.02865 20.7197 2.94209 20.6008 2.88874C20.482 2.83539 20.3502 2.81752 20.2215 2.83727C20.0927 2.85703 19.9724 2.91358 19.875 3.00011C19.233 3.57011 18.267 3.57011 17.625 3.00011C17.3151 2.72451 16.9147 2.57227 16.5 2.57227C16.0853 2.57227 15.6849 2.72451 15.375 3.00011C14.733 3.57011 13.767 3.57011 13.125 3.00011C12.8151 2.72451 12.4147 2.57227 12 2.57227C11.5853 2.57227 11.1849 2.72451 10.875 3.00011C10.233 3.57011 9.267 3.57011 8.625 3.00011C8.31507 2.72451 7.91475 2.57227 7.5 2.57227C7.08525 2.57227 6.68493 2.72451 6.375 3.00011C5.733 3.57011 4.767 3.57011 4.125 3.00011C4.02761 2.91358 3.90729 2.85703 3.77852 2.83727C3.64975 2.81752 3.51802 2.83539 3.39916 2.88874C3.28031 2.94209 3.17941 3.02865 3.10859 3.138C3.03778 3.24735 3.00007 3.37483 3 3.50511V20.4951C3 21.0781 3.69 21.3881 4.125 21.0001C4.43493 20.7245 4.83525 20.5723 5.25 20.5723C5.66475 20.5723 6.06507 20.7245 6.375 21.0001C7.017 21.5701 7.983 21.5701 8.625 21.0001C8.93493 20.7245 9.33525 20.5723 9.75 20.5723C10.1647 20.5723 10.5651 20.7245 10.875 21.0001C11.517 21.5701 12.483 21.5701 13.125 21.0001C13.4349 20.7245 13.8353 20.5723 14.25 20.5723C14.6647 20.5723 15.0651 20.7245 15.375 21.0001C16.017 21.5701 16.983 21.5701 17.625 21.0001Z"
        stroke="#000000"
        strokeWidth="1.5"
      />

      <path
        d="M7.5 15.5H16.5M7.5 12H16.5M7.5 8.5H16.5"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Aceternity-style Daakit logos

const Logo = () => {
  return (
    <Link
      to="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <img
        src={DaakitIcon2}
        alt="Daakit"
        className="h-10 w-full shrink-0 rounded-md object-contain"
      />
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <img src={DaakitIcon} alt="Daakit" className="h-10 w-10 shrink-0 rounded-md object-contain" />
    </Link>
  );
};

function Navbar({ allowedRoles, children }) {
  const [open, setOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false,
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [permissions, setPermissions] = useState(`${localStorage.getItem("permission")}`);

  const token = localStorage.getItem("token");

  const decoded = token ? jwtDecode(token) : {};

  const [isOpen, setIsOpen] = useState("");

  const [orders, setOrders] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [profile, setProfile] = useState({});

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const handleViewportChange = (event) => {
      setIsMobile(event.matches);

      setOpen(false);

      setMobileOpen(false);
    };

    setIsMobile(media.matches);

    media.addEventListener("change", handleViewportChange);

    return () => media.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getUserPermissions = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/user/getUserPermissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPermissions(res?.data?.data?.data);
    } catch (error) {
      toast.error("");
    } finally {
      setLoading(false);
    }
  };

  const getNavLinks = () => {
    const navConfig = {
      admin: [
        {
          label: "Dashboard",
          href: "/admin/analytics",
          icon: <DashboardIcon />,
        },
        {
          label: "Operation",
          href: "#",
          icon: <OperationIcon />,
          subItems: [
            {
              label: "Loadout",
              href: "/admin/loadout",
              icon: <LuPackageOpen className="h-4 w-4" />,
            },
            {
              label: "Orders",
              href: "/admin/order-details",
              icon: <TbPackage className="h-4 w-4" />,
            },

            {
              label: "NDR (Exception)",
              href: "/admin/ndr",
              icon: <NoSymbolIcon className="h-4 w-4" />,
            },
            {
              label: "Weight (Reconciliation)",
              href: "/admin/weight/reconciliation",
              icon: <Weight className="h-4 w-4" />,
            },
            // {
            //   label: "MIS",
            //   href: "/admin/weightMIS",
            //   icon: <MdOutlineAssessment className="h-4 w-4" />,
            // },
            // {
            //   label: "Discrepancies",
            //   href: "/admin/dispute",
            //   icon: <FiAlertTriangle className="h-4 w-4" />,
            // },
          ],
        },
        {
          label: "OnBoarding",
          href: "#",
          icon: (
            <MdOutlineAppRegistration className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
          subItems: [
            { label: "DC", href: "/admin/dc/list", icon: <FaWarehouse className="h-4 w-4" /> },
            {
              label: "Merchant",
              href: "/admin/merchant-details",
              icon: (
                <MdOutlineBusinessCenter className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: "Vendor",
              href: "/admin/vendor-stats",
              icon: <TbDeviceWatchStats className="h-4 w-4" />,
            },
            {
              label: "Vendor Riders",
              href: "/admin/vendor-riders",
              icon: <MdDirectionsBike className="h-4 w-4" />,
            },
          ],
        },

        // { label: "Weight", href: "#", icon: <MdOutlineScale  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        //  subItems: [
        //       { label: "MIS", href: "/admin/weightMIS" },
        //       { label: "Discrepancies",  href: "/admin/dispute",},
        //     ],
        // },

        {
          label: "Finance",
          href: "#",
          icon: <FinanceIcon />,
          subItems: [
            {
              label: "Billing & Invoices",
              href: "/admin/billingandinvoices",
              icon: <BillingIcon />,
            },
            {
              label: "COD Remittances",
              href: "/admin/cod-remittances",
              icon: <LuReceiptIndianRupee className="h-4 w-4" />,
            },
            {
              label: "Merchant Remittances",
              href: "/admin/merchant-remittances",
              icon: <FaUserTie className="h-4 w-4" />,
            },
          ],
        },

        {
          label: "Settings",
          href: "#",
          icon: <FiSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            {
              label: "Coupon",
              href: "/admin/coupon",
              icon: <RiCoupon2Fill className="h-4 w-4" />,
            },
            {
              label: "Subscription",
              href: "/admin/subscription",
              icon: <MdOutlineSubscriptions className="h-4 w-4" />,
            },
            {
              label: "Pricing",
              href: "/admin/pricing",
              icon: <ImPriceTag className="h-4 w-4" />,
            },
            {
              label: "Add New User",
              href: "/admin/add-user",
              icon: <FaUserPlus className="h-4 w-4" />,
            },
            {
              label: "Add Role & Permission",
              href: "/admin/role-permission",
              icon: <MdAdminPanelSettings className="h-4 w-4" />,
            },
            {
              label: "Rider's Live Location",
              href: "/admin/map",
              icon: (
                <FaMapMarkedAlt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            },
            {
              label: "Session Management",
              href: "/admin/session-management",
              icon: <FiMonitor className="h-4 w-4" />,
            },
          ],
        },
      ],

      user: [
        ...(permissions.includes("DASHBOARD_VIEW") || permissions.includes("ADMIN_FULL_ACCESS")
          ? [
              {
                label: "Dashboard",
                href: "/user/analytics",
                icon: <DashboardIcon />,
              },
            ]
          : []),

        ...(permissions.includes("ODR_VIEW") ||
        permissions.includes("NDR_VIEW") ||
        permissions.includes("LOADOUT_VIEW") ||
        permissions.includes("ADMIN_FULL_ACCESS")
          ? [
              {
                label: "Operation",
                href: "#",
                icon: <OperationIcon />,
                subItems: [
                   // Loadout Permission
                   
                  ...(permissions.includes("LOADOUT_VIEW") ||
                  permissions.includes("ADMIN_FULL_ACCESS")
                    ? [
                        {
                          label: "Loadout",
                          href: "/user/loadout",
                          icon: (
                            <LoadoutIcon  />
                          ),
                        },
                      ]
                    : []),

                  // Orders Permission
                  ...(permissions.includes("ODR_VIEW") || permissions.includes("ADMIN_FULL_ACCESS")
                    ? [
                        {
                          label: "Orders",
                          href: "/user/order-details",
                          icon: (
                            <MdOutlineAssignment className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                          ),
                        },
                      ]
                    : []),

                  // NDR Permission
                  ...(permissions.includes("NDR_VIEW") || permissions.includes("ADMIN_FULL_ACCESS")
                    ? [
                        {
                          label: "NDR",
                          href: "/user/ndr",
                          icon: (
                            <NoSymbolIcon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                          ),
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),


        ...(
          permissions.includes("VIEW_DC") || 
          permissions.includes("VIEW_RIDER") || 
          permissions.includes("VIEW_VENDOR") || 
          permissions.includes("ADMIN_FULL_ACCESS")
          ? [
              {
                label: "Onboarding",
                href: "#",
                icon: <MdOutlineAppRegistration className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
                subItems: [
                  // Orders Permission
                  ...(permissions.includes("VIEW_DC") || permissions.includes("ADMIN_FULL_ACCESS")
                    ? [
                        {
                          label: "DC",
                          href: "/user/dc/list",
                          icon: (
                            <FaWarehouse className="h-4 w-4" />
                          ),
                        },
                      ]
                    : []),
                  ...(permissions.includes("VIEW_RIDER") || permissions.includes("ADMIN_FULL_ACCESS")
                    ? [
                        {
                          label: "Riders",
                          href: "/user/rider/details",
                          icon: (
                            <MdOutlineTwoWheeler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                          ),
                        },
                      ]
                    : []),
                  
                  ...(permissions.includes("VIEW_VENDOR") || permissions.includes("ADMIN_FULL_ACCESS")
                    ? [
                        {
                          label: "Vendors",
                          href: "/user/vendor/details",
                          icon: (
                            <MdOutlineStorefront className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                          ),
                        },
                      ]
                    : []),

                  
                  
                ],
              },
            ]
          : []),



        ...(
          permissions.includes("REMITTANCE_VIEW") || 
          permissions.includes("REMITTANCE_MERCHANT_VIEW") || 
          permissions.includes("ADMIN_FULL_ACCESS")
          ? [
              {
                label: "Finance",
                href: "#",
                icon: <FinanceIcon />,
                subItems: [
                  // Orders Permission
                  ...(permissions.includes("REMITTANCE_VIEW") || permissions.includes("ADMIN_FULL_ACCESS")
                    ? [
                        {
                          label: "COD Remittance",
                          href: "/user/cod-remittances",
                          icon: (
                            <LuReceiptIndianRupee className="h-4 w-4" />
                          ),
                        },
                      ]
                    : []),
                  ...(permissions.includes("REMITTANCE_MERCHANT_VIEW") || permissions.includes("ADMIN_FULL_ACCESS")
                    ? [
                        {
                          label: "Merchant Remittance",
                          href: "/user/merchant-remittances",
                          icon: (
                            <FaUserTie className="h-4 w-4" />
                          ),
                        },
                      ]
                    : []),
                  
                ],
              },
            ]
          : []),






      ],

      vendor: [
        {
          label: "Dashboard",
          href: "/vendor/analytics",
          icon: <DashboardIcon />,
        },

        {
          label: "Operation",
          href: "#",
          icon: <OperationIcon />,
          subItems: [
            {
              label: "Assigned Pickups",
              href: "/vendor/assign/pickup",
              icon: <AssignedPickupsIcon />,
            },
            {
              label: "Loadout",
              href: "/vendor/loadout",
              icon: <LuPackageOpen className="h-5 w-5" />,
            },
            {
              label: "Orders",
              href: "/vendor/rider-orders",
              icon: <OrderIcon className="h-5 w-5" />,
            },
            
          ],
        },

        {
          label: "Finance",
          href: "#",
          icon: <FinanceIcon />,
          subItems: [
            {
              label: "Remittances",
              href: "/vendor/remittance-record",
              icon: <RemittanceIcon />,
            },
          ],
        },

        {
          label: "Rider",
          href: "#",
          icon: (
            <MdDirectionsBike className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
          subItems: [
            {
              label: "Riders",
              href: "/vendor/riders",
              icon: <MdDirectionsBike className="h-4 w-4" />,
            },
            {
              label: "COD Remittances",
              href: "/vendor/cod-remittances",
              icon: <FaIndianRupeeSign className="h-4 w-4" />,
            },
            {
              label: "Rider Onboarding",
              href: "/vendor/rider-onboarding",
              icon: <FaWpforms className="h-4 w-4" />,
            },
            {
              label: "Rider's Live Location",
              href: "/vendor/map",
              icon: <RiderLocationIcon />,
            },
            {
              label: "Rate List",
              href: "/vendor/rider_rate/list",
              icon: <RateListIcon />,
            },
            {
              label: "Rider Performance",
              href: "/vendor/shipment-tracking",
              icon: <RatePerIcon />,
            },
          ],
        },

        {
          label: "Hub",
          href: "#",
          icon: <MdWarehouse className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            {
              label: "Hub List",
              href: "/vendor/hub_list",
              icon: <HubIcon />,
            },
          ],
        },

        {
          label: "Support",
          href: "/vendor/support",
          icon: <SupportIcon />,
        },
      ],

      dc: [
        {
          label: "Dashboard",
          href: "/dc/analytics",
          icon: <DashboardIcon />,
        },

        {
          label: "Operation",
          href: "#",
          icon: <OperationIcon />,
          subItems: [
            {
              label: "Assigned Pickups",
              href: "/dc/assign/pickup",
              icon: <AssignedPickupsIcon />,
            },
            {
              label: "Loadout",
              href: "/dc/loadout",
              icon: <LoadoutIcon />,
            },
            {
              label: "Orders",
              href: "/dc/rider-orders",
              icon: <TbPackage className="h-4 w-4" />,
            },
            // {
            //   label: "New Mapped Orders",
            //   href: "/dc/mapped-orders",
            //   icon: <TbPackage className="h-4 w-4" />,
            // },
          ],
        },

        {
          label: "Finance",
          href: "#",
          icon: <FinanceIcon />,
          subItems: [
            {
              label: "Self Remittance",
              href: "/dc/remittance-record",
              icon: <RemittanceIcon />,
            },
            {
              label: "vendor Remittance",
              href: "/dc/vendor/remittance-record",
              icon: <HandCoins size={18} strokeWidth={1.8} />,
            },
          ],
        },

        {
          label: "Rider",
          href: "#",
          icon: (
            <MdDirectionsBike className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          ),
          subItems: [
            {
              label: "Riders",
              href: "/dc/riders",
              icon: <MdDirectionsBike className="h-4 w-4" />,
            },
            {
              label: "COD Remittances",
              href: "/dc/cod-remittances",
              icon: <FaIndianRupeeSign className="h-4 w-4" />,
            },
            {
              label: "Rider's Live Location",
              href: "/dc/map",
              icon: <FaMapMarkedAlt className="h-4 w-4" />,
            },
            // {
            //   label: "Rate List",
            //   href: "/dc/rider_rate/list",
            //   icon: <LuReceiptIndianRupee className="h-4 w-4" />,
            // },
            // {
            //   label: "Rider Performance",
            //   href: "/dc/shipment-tracking",
            //   icon: <CiDeliveryTruck className="h-4 w-4" />,
            // },
          ],
        },

        {
          label: "Vendor Management",
          href: "#",
          icon: <FaUsersGear className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            {
              label: "Vendor",
              href: "/dc/vendor/listing",
              icon: <MdPersonAddAlt1 className="h-4 w-4" />,
            },
          ],
        },
        {
          label: "Hub",
          href: "#",
          icon: <MdWarehouse className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            {
              label: "Hub List",
              href: "/dc/hub_list",
              icon: <FaTruck className="h-4 w-4" />,
            },
          ],
        },

        {
          label: "Support",
          href: "/dc/support",
          icon: <LifeBuoy className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
      ],

      merchant:
        decoded.tech_based !== "1"
          ? [
              {
                label: "Dashboard",
                href: "/merchant/analytics",
                icon: <DashboardIcon />,
              },
              {
                label: "Operation",
                href: "#",
                icon: <OperationIcon />,
                subItems: [
                  {
                    label: "Unverified Orders",
                    href: "/merchant/order-draft",
                    icon: <TbPackageOff className="h-4 w-4" />,
                  },
                  {
                    label: "All Orders",
                    href: "/merchant/order-details",
                    icon: <TbPackage className="h-4 w-4" />,
                  },
                  {
                    label: "NDR",
                    href: "/merchant/ndr",
                    icon: <NoSymbolIcon className="h-4 w-4" />,
                  },
                ],
              },

              {
                label: "Weight Discrepancies",
                href: "/merchant/weight",
                icon: (
                  <MdOutlineScale className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
              },
              {
                label: "Finance",
                href: "#",
                icon: <FinanceIcon />,
                subItems: [
                  {
                    label: "Billing",
                    href: "/merchant/billing",
                    icon: <BillingIcon className="h-4 w-4" />,
                  },
                  {
                    label: "Recharge",
                    href: "/merchant/recharge",
                    icon: <RechargeIcon />,
                  },
                  {
                    label: "Transaction",
                    href: "/merchant/transaction",
                    icon: <TransactionIcon />,
                  },
                  {
                    label: "Remittances",
                    href: "/merchant/remittance",
                    icon: <RemittanceIcon />,
                  },
                  {
                    label: "Pricing Plan",
                    href: "/merchant/pricing/details",
                    icon: <PricingPlanIcon />,
                  },
                  {
                    label: "Pricing Calculator",
                    href: "/merchant/pricing/calculate",
                    icon: <PricingCalcuIcon />,
                  },
                ],
              },

              {
                label: "Setting",
                href: "#",
                icon: <SettingIcon />,
                subItems: [
                  {
                    label: "Change Password",
                    href: "/merchant/change-password",
                    icon: <ChnagePasswordIcon />,
                  },
                  {
                    label: "Security Key",
                    href: "/merchant/security-key",
                    icon: <SecurityKeyIcon />,
                  },
                  {
                    label: "Label Setting",
                    href: "/merchant/label/setting",
                    icon: <LabelIcon />,
                  },
                  {
                    label: "Order Slab Allocation",
                    href: "/merchant/orderSlabAllocation",
                    icon: <SlidersHorizontal  className="h-4 w-4" />,
                  },
                ],
              },

              {
                label: "VAS",
                href: "#",
                icon: <VASIcon />,
                subItems: [
                  {
                    label: "Channels",
                    href: "/merchant/channels",
                    icon: <Network size={20} color="#374151" />,
                  },
                  {
                    label: "ETA Widget",
                    href: "/merchant/integration",
                    icon: <ETAWidget />,
                  },
                  {
                    label: "Insurance",
                    href: "/merchant/insurance",
                    icon: <InsuranceIcon />,
                  },
                ],
              },
            ]
          : [
              {
                label: "Dashboard",
                href: "/techbased_merchant/analytics",
                icon: (
                  <IoHomeOutline className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
              },
              // { label: "CX", href: "/techbased_merchant/cx", icon: <FaGears className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },

              {
                label: "Operation",
                href: "#",
                icon: (
                  <MdBuild className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
                subItems: [
                  {
                    label: "Unverified Orders",
                    href: "/techbased_merchant/order-draft",
                    icon: <TbPackageOff className="h-4 w-4" />,
                  },
                  {
                    label: "All Orders",
                    href: "/techbased_merchant/order-details",
                    icon: <TbPackage className="h-4 w-4" />,
                  },
                  {
                    label: "NDR",
                    href: "/techbased_merchant/ndr",
                    icon: <NoSymbolIcon className="h-4 w-4" />,
                  },
                ],
              },

              {
                label: "Self Rider",
                href: "#",
                icon: (
                  <MdDirectionsBike className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
                subItems: [
                  // { label: "Rider OnBoarding", href: "/techbased_merchant/rider/onboarding", icon: <FaUserTie className="h-4 w-4" /> },
                  {
                    label: "Riders",
                    href: "/techbased_merchant/rider/stats",
                    icon: <TbMotorbike className="h-4 w-4" />,
                  },
                  // { label: "Rider Performance", href: "/techbased_merchant/rider/shipment/tracking", icon: <TbChartBar  className="h-4 w-4" /> },
                  {
                    label: "Live Location",
                    href: "/techbased_merchant/rider/live_location",
                    icon: <FaMapMarkedAlt className="h-4 w-4" />,
                  },
                  {
                    label: "COD Collection",
                    href: "/techbased_merchant/cod_remittances",
                    icon: <LuReceiptIndianRupee className="h-4 w-4" />,
                  },
                  {
                    label: "Rate Card",
                    href: "/techbased_merchant/rider_rate/list",
                    icon: <LuReceiptIndianRupee className="h-4 w-4" />,
                  },
                ],
              },

              {
                label: "Finance",
                href: "#",
                icon: (
                  <MdAccountBalance className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
                subItems: [
                  {
                    label: "Recharge & Subscription",
                    href: "/techbased_merchant/recharge",
                    icon: <FaBolt className="h-4 w-4" />,
                  },
                  {
                    label: "Transaction",
                    href: "/techbased_merchant/transaction",
                    icon: <FaMoneyBillTransfer className="h-4 w-4" />,
                  },
                  {
                    label: "Remittances",
                    href: "/techbased_merchant/codemittances",
                    icon: <MdSwapHoriz className="h-4 w-4" />,
                  },
                  {
                    label: "Pricing Plan",
                    href: "/techbased_merchant/pricing/details",
                    icon: <IndianRupee className="h-4 w-4" />,
                  },
                  {
                    label: "Pricing Calculator",
                    href: "/techbased_merchant/pricing/calculate",
                    icon: <IndianRupee className="h-4 w-4" />,
                  },
                ],
              },

              {
                label: "Setting",
                href: "#",
                icon: (
                  <MdOutlineSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
                subItems: [
                  {
                    label: "Change Password",
                    href: "/techbased_merchant/change-password",
                    icon: <FaKey className="h-4 w-4" />,
                  },
                  {
                    label: "Security Key",
                    href: "/techbased_merchant/security-key",
                    icon: <FaShieldAlt className="h-4 w-4" />,
                  },
                  {
                    label: "Label Setting",
                    href: "/techbased_merchant/label/setting",
                    icon: <MdLabel className="h-4 w-4" />,
                  },
                  {
                    label: "Integration",
                    href: "/merchant/integration",
                    icon: <MdLink className="h-4 w-4" />,
                  },
                  // { label: "Insurance", href: "/techbased_merchant/insurance", icon: <ShieldCheck className="h-4 w-4" /> },
                ],
              },

              {
                label: "Support",
                href: "/techbased_merchant/support",
                icon: (
                  <LifeBuoy className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
              },
            ],
    };

    const currentRole = allowedRoles?.includes("admin")
      ? "admin"
      : allowedRoles?.includes("vendor")
        ? "vendor"
        : allowedRoles?.includes("user")
          ? "user"
          : allowedRoles?.includes("dc")
            ? "dc"
            : "merchant";

    return navConfig[currentRole] || [];
  };

  const clearStorageAndRedirect = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("userType");

    localStorage.removeItem("permission");

    localStorage.clear();
  };

  const handleLogout = async () => {
    try {
      const role = decoded.usertype || decoded.type || decoded.userType || decoded?.user_type;

      if (role === "vendor") {
        clearStorageAndRedirect();
        await AxiosInstance.post(`/api/vendor/vendorLogout`);
        navigate("/login");
      } else if (role === "admin") {
        clearStorageAndRedirect();
        await AxiosInstance.post(`/api/admin/logout`);

        navigate("/login/admin");
      } else if (UserRoles.includes(role)) {
        clearStorageAndRedirect();
        await AxiosInstance.post(`/api/user/logout`);
        navigate("/login/user");
      } else if (role == "dc") {
        clearStorageAndRedirect();
        await AxiosInstance.post(`/api/dc/logout`);
        navigate("/login");
      } else {
        clearStorageAndRedirect();
        await AxiosInstance.post(`/api/merchant/merchantLogout`);
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
        },
      );

      setProfile(res.data.data);

      
    } catch (error) {}
  };

  const getTechMerchantProfile = async () => {
    try {
      const res = await AxiosInstance.get("/api/tech-merchant/getMerchantProfile");

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
        },
      );

      setProfile(res.data.data);
     
    } catch (error) {
      console.error("profile", error);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Session Expired!!!");

      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (decoded.tech_based === "1") {
      getTechMerchantProfile();
    } else if (decoded.tech_based === "0") {
      getMerchantProfile();
    } else if (decoded?.type === "vendor") {
      getVendorProfile();
    } else {
      return;
    }
  }, []);

  const [query, setQuery] = useState("");

  // Aceternity SidebarLink + nested menu support

  const CustomSidebarLink = ({
    link,

    isOpen,

    standalone = false,

    onNavigate,
  }) => {
    const [showSubItems, setShowSubItems] = useState(false);

    if (!link.subItems) {
      if (!standalone) {
        return <SidebarLink link={link} />;
      }

      return (
        <NavLink
          to={link.href}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex h-10 w-full items-center gap-2 rounded-md px-1 text-sm transition-colors",

              isActive
                ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-white"
                : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
            )
          }
        >
          {link.icon}

          <span className="truncate">{link.label}</span>
        </NavLink>
      );
    }

    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setShowSubItems((prev) => !prev)}
          className={cn(
            "group/sidebar flex h-10 w-full items-center px-3 rounded-md text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",

            isOpen ? "justify-between px-2" : "justify-center px-0",
          )}
        >
          <span className="flex min-w-0  items-center gap-2">
            <span className=" text-xl">{link.icon}</span>

            {isOpen && (
              <span className="truncate whitespace-pre text-sm text-neutral-700 transition duration-150 group-hover/sidebar:translate-x-1 dark:text-neutral-200">
                {link.label}
              </span>
            )}
          </span>

          {isOpen && (
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 dark:text-neutral-400",

                showSubItems && "rotate-180",
              )}
            />
          )}
        </button>

        {isOpen && showSubItems && (
          <div className="ml-6 mt-1 space-y-1 border-l border-neutral-200 pl-3 dark:border-neutral-700">
            {link.subItems.map((subItem, idx) => (
              <NavLink
                key={`${subItem.href}-${idx}`}
                to={subItem.href}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",

                    isActive
                      ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white",
                  )
                }
              >
                {subItem.icon}

                <span className="truncate">{subItem.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  const toggleTheme = () => {
    const next = !darkMode;

    setDarkMode(next);

    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div
      className="

      flex

      h-screen

      w-full

      min-w-0

      overflow-hidden

      bg-[#F5F6F8]

      dark:bg-neutral-800

    "
    >
      {/* =====================================================
        DESKTOP SIDEBAR
        FIX: ONLY MENU SCROLLS ON BROWSER ZOOM
      ====================================================== */}
      {!isMobile && (
        <div
          className="
            relative
            flex
            h-screen
            min-h-0
            min-w-0
            shrink-0
            flex-col
            overflow-hidden
            rounded-tl-[24px]
            border-l
            border-t
            
            border-neutral-200
            bg-[#F5F6F8]
            dark:border-neutral-800
            dark:bg-neutral-950
          "
        >
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody
              className="
                flex
                h-full
                min-h-0
                flex-col
                gap-0
                overflow-hidden
                px-2
                py-3
              "
            >
              {/* LOGO - FIXED */}
              <div
                className={cn(
                  "flex h-10 shrink-0 items-center bg-[#F5F6F8] dark:bg-neutral-800",
                  open ? "justify-start px-1" : "justify-center",
                )}
              >
                {open ? <Logo /> : <LogoIcon />}
              </div>

              {/* NAV LINKS - THIS IS THE ONLY SCROLL AREA */}
              <div
                className="
                  mt-5
                  min-h-0
                  flex-1
                  overflow-y-auto
                  overflow-x-hidden
                  overscroll-contain
                  pr-1
                  pb-3
                  [scrollbar-width:thin]
                  [scrollbar-color:#d4d4d4_transparent]
                  dark:[scrollbar-color:#404040_transparent]
                  [&::-webkit-scrollbar]:w-[5px]
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-neutral-300
                  hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400
                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
                  dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600
                "
              >
                <div className="flex flex-col gap-1 pb-2 ">
                  {getNavLinks().map((link, idx) => (
                    <CustomSidebarLink
                      key={`${link.label}-${idx}`}
                      link={link}
                      isOpen={open}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
              </div>

              {/* LOGOUT - FIXED AT BOTTOM */}
              <div
                className="
                  shrink-0
                  border-t
                  border-neutral-200
                  bg-[#F5F6F8]
                  pt-3
                  dark:border-neutral-700
                  dark:bg-neutral-950
                "
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className={cn(
                    `
                      group/sidebar
                      flex
                      h-10
                      w-full
                      items-center
                      rounded-md
                      text-sm
                      text-neutral-700
                      transition-colors
                      hover:bg-red-50
                      hover:text-red-600
                      dark:text-neutral-200
                      dark:hover:bg-red-950/20
                      dark:hover:text-red-400
                    `,
                    open ? "gap-2 px-2" : "justify-center px-0",
                  )}
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  {open && <span className="whitespace-nowrap">Logout</span>}
                </button>
              </div>
            </SidebarBody>
          </Sidebar>
        </div>
      )}

      {/* =====================================================

        MOBILE DRAWER

    ====================================================== */}

      {isMobile && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className={cn(
              `

              fixed

              inset-0

              z-[60]

              bg-black/40

              transition-opacity

              duration-300

            `,

              mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
            )}
          />

          <aside
            className={cn(
              `

              fixed

              inset-y-0

              left-0

              z-[70]

              w-[280px]

              max-w-[86vw]

              border-r

              border-neutral-200

              bg-white





              transition-transform

              duration-300

              dark:border-neutral-800

              dark:bg-neutral-950

            `,

              mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            {/* DRAWER HEADER */}

            <div
              className="

              flex

              h-14

              items-center

              justify-between

              border-b

              border-neutral-200

              px-4

              dark:border-neutral-800

            "
            >
              <Logo />

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="

                grid

                h-9

                w-9

                place-items-center

                rounded-lg

                text-neutral-600

                hover:bg-neutral-100

                dark:text-neutral-300

                dark:hover:bg-neutral-800

              "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* DRAWER BODY */}

            <div className="flex h-[calc(100dvh-56px)] flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <div className="space-y-1">
                  {getNavLinks().map((link, idx) => (
                    <CustomSidebarLink
                      key={`${link.label}-${idx}`}
                      link={link}
                      isOpen={true}
                      standalone
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
              </div>

              <div
                className="

                shrink-0

                border-t

                border-neutral-200

                p-3

                dark:border-neutral-800

              "
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className="

                  flex

                  h-10

                  w-full

                  items-center

                  gap-2

                  rounded-md

                  px-2

                  text-sm

                  text-red-600

                  hover:bg-red-50

                  dark:hover:bg-red-950/20

                "
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* =====================================================

        RIGHT SIDE

    ====================================================== */}

      <div
        className="

    relative

    flex

    h-screen

    min-h-0

    min-w-0

    flex-1

    flex-col

    overflow-hidden

    rounded-tl-2xl

    border-l

    border-t

    border-neutral-200

    bg-[#F5F6F8]

    dark:border-neutral-800

    dark:bg-neutral-950

  "
      >
        {/* ===================================================

          GLASS HEADER

          ABSOLUTE OVER CONTENT

      ==================================================== */}

        <div
          className="

          pointer-events-none

          absolute

          left-0

          right-0

          top-0

          z-50



        "
        >
          <GlassSurface
            width="100%"
            height={64}
            borderRadius={0}
            borderWidth={0.07}
            brightness={50}
            opacity={0.93}
            blur={5}
            displace={0.6}
            backgroundOpacity={0.1}
            saturation={1.5}
            distortionScale={-120}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            xChannel="R"
            yChannel="G"
            mixBlendMode="screen"
            className="

            pointer-events-auto

            w-full

          "
          >
            <header className="h-full w-full rounded-tl-3xl">
              <div
                className="

                flex

                h-full

                w-full

                min-w-0

                items-center

                 px-4



              "
              >
                {/* MOBILE MENU */}

                {isMobile && (
                  <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="
                 ml-2
                    grid

                    h-10

                    w-10

                    shrink-0

                    place-items-center

                    rounded-xl

                    border

                    border-white/50

                    bg-white/25

                    text-neutral-700





                    backdrop-blur-xl

                    transition-all

                    hover:bg-white/55

                    hover:text-[#0446DB]

                    dark:border-white/10

                    dark:bg-white/[0.06]

                    dark:text-white

                    dark:hover:bg-white/10

                  "
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                )}

                {/* PUSH ACTIONS RIGHT */}

                <div className="min-w-0 flex-1" />
                 {
                   console.log(decoded)
                 }
                {/* ACTIONS */}
                <div>{
               
                ["admin","customer", "operations", "support", "finance", "sales", "marketing"].includes(decoded?.usertype) && <OrderSearch role={decoded?.usertype}/>}</div>

                <div
                  className="

                  flex

                  shrink-0

                  items-center
                 px-4
                  gap-2

                "
                >
                  {/* WALLET */}

                  {(decoded?.role === "merchant" || decoded?.userType === "merchant") && (
                    <Link
                      to={
                        decoded?.tech_based === "1"
                          ? "/techbased_merchant/recharge"
                          : "/merchant/recharge"
                      }
                      className="

                      hidden

                      h-10

                      items-center

                      gap-1.5

                      whitespace-nowrap

                      rounded-sm

                      border

                      

                      border-gray-200

                      px-3

                      text-sm

                      font-medium

                      text-neutral-700





                      backdrop-blur-xl

                      transition-all

                      hover:border-[#0446DB]/25

                      hover:bg-white/55

                      hover:text-[#0446DB]

                      md:flex

                      dark:border-white/10

                      dark:bg-white/[0.06]

                      dark:text-neutral-200

                      dark:hover:bg-white/10

                      dark:hover:text-blue-400

                    "
                    >
                      <Wallet className="h-4 w-4" />

                      <span className="flex items-center">
                        <IndianRupee className="h-3.5 w-3.5" />

                        {Math.trunc(Number(profile?.wallet_balance || 0)).toLocaleString("en-IN")}
                      </span>
                    </Link>
                  )}

                  {/* THEME */}

                  <button
                    type="button"
                    onClick={toggleTheme}
                    title="Toggle theme"
                    className="

                    grid

                    h-10

                    w-10

                    shrink-0

                    place-items-center

                    rounded-sm

                    border

                    border-gray-200

                    bg-white/28

                    text-neutral-600





                    backdrop-blur-xl

                    transition-all

                    hover:border-[#0446DB]/25

                    hover:bg-white/55

                    hover:text-[#0446DB]

                    dark:border-white/10

                    dark:bg-white/[0.06]

                    dark:text-neutral-300

                    dark:hover:bg-white/10

                    dark:hover:text-blue-400

                  "
                  >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>

                  {/* DIVIDER */}

                  <div
                    className="

                    hidden

                    h-6

                    w-px

                    bg-neutral-400/30

                    sm:block

                    dark:bg-white/10

                  "
                  />

                  {/* PROFILE */}

                  <DropdownMenuDemo
                    profile={profile}
                    decoded={decoded}
                    UserRoles={UserRoles}
                    handleLogout={handleLogout}
                  />
                </div>
              </div>
            </header>
          </GlassSurface>
        </div>

        {/* ===================================================

          ONLY RIGHT CONTENT SCROLLS

      ==================================================== */}

        <main
          className="

          min-h-0

          min-w-0

          flex-1

          overflow-x-hidden

          overflow-y-auto

          bg-[#F5F6F8]

          dark:bg-neutral-950

        "
        >
          {/*

          IMPORTANT:

          pt-[84px] initially content ko header ke neeche rakhega.

          Jab content scroll hoga, wahi content glass header ke

          peeche se pass hoga, jisse actual backdrop blur/glass

          visible hoga.

        */}

          <div
            className="

            min-h-full

            w-full

            min-w-0

            px-2

            pb-4

            pt-[84px]

            md:px-4

            md:pb-4

          "
          >
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Navbar;
